/* eslint-disable unicorn/import-style */
import {Command, Flags} from '@oclif/core'
import ffmpegStatic from 'ffmpeg-static'
import {spawn} from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'

const ffmpegPath = ffmpegStatic as unknown as string | undefined

// Function to check if ffmpeg is available
const isFfmpegAvailable = (): boolean => ffmpegPath !== null && ffmpegPath !== undefined

// Function to find all audio files in a directory (MP3, OGG, and other formats)
const findAudioFiles = (dir: string): string[] => {
  const files = fs.readdirSync(dir)
  return files.filter((file) => {
    const lowerFile = file.toLowerCase();
    return (lowerFile.endsWith('.mp3') || lowerFile.endsWith('.ogg') || lowerFile.endsWith('.m4a') || lowerFile.endsWith('.flac')) 
           && fs.statSync(path.join(dir, file)).isFile()
  })
}

// Function to convert an audio file to the specified format using ffmpeg
const convertAudioFile = (inputFile: string, format: string, quality: number, mono: boolean, stereo: boolean, outputDir: string = '.'): Promise<void> =>
  new Promise((resolve, reject) => {
    const inputExt = path.extname(inputFile).toLowerCase(); 
    const fileNameWithoutExt = path.basename(inputFile, inputExt);
    const outputFile = path.join(outputDir, `${fileNameWithoutExt}.${format}`)

    // Map format names to appropriate ffmpeg codecs and quality parameters
    let qualityFlag = ''
    let qualityValue = ''

    switch (format) {
      case 'flac': {
        qualityFlag = '-compression_level'
        // For flac, use quality value directly (0-12) but map the range 0-10 to appropriate FLAC levels
        qualityValue = Math.min(12, quality).toString() // FLAC compression level 0-12
        break
      }

      case 'm4a': {
        qualityFlag = '-b:a' // Bitrate for aac
        // Map quality (0-10) to bitrate (kbps) - higher quality = higher bitrate
        const bitrate = Math.max(64, 320 - quality * 24) // Maps to ~64-320 kbps range
        qualityValue = `${bitrate}k`
        break
      }

      case 'ogg': {
        qualityFlag = '-q:a'
        qualityValue = quality.toString() // For ogg, quality is 0-10 (0=highest, 10=lowest)
        break
      }

      default: {
        reject(new Error(`Unsupported format: ${format}`))
        return
      }
    }

    // Build the argument list for ffmpeg
    const args = ['-i', inputFile]
    
    // Add channel configuration if specified
    if (mono && !stereo) {
      args.push('-ac', '1') // Force mono
    } else if (stereo && !mono) {
      args.push('-ac', '2') // Force stereo
    }
    
    // Add quality settings
    args.push(qualityFlag, qualityValue)
    
    // Add output file
    args.push(outputFile, '-y')

    // Use ffmpeg to convert audio to the specified format with quality settings
    const ffmpegProcess = spawn(ffmpegPath!, args, {
      shell: true, // Add shell option to properly resolve PATH on Windows
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    // Capture stderr to show progress if needed
    ffmpegProcess.stderr.on('data', () => {
      // Optional: can parse progress info from stderr if needed
    })

    // Handle process events for better error handling
    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`ffmpeg exited with code ${code}. Conversion failed for ${inputFile}`))
      }
    })

    ffmpegProcess.on('error', (error) => {
      reject(new Error(`FFmpeg process error: ${error.message}`))
    })
  })

// Function to convert multiple audio files to the specified format
const convertMultipleAudioFiles = async (
  audioFiles: string[],
  format: string,
  quality: number,
  mono: boolean,
  stereo: boolean,
  log: (message: string) => void,
  error: (message: string) => void,
  // eslint-disable-next-line max-params
): Promise<void> => {
  if (audioFiles.length === 0) {
    log('No audio files found in the current directory.')
    return
  }

  log(`Found ${audioFiles.length} audio file(s) to convert to ${format.toUpperCase()}.`)
  if (mono) {
    log('Output will be forced to mono.')
  } else if (stereo) {
    log('Output will be forced to stereo.')
  } else {
    log('Output will preserve original channel configuration.')
  }

  // Determine the output directory based on flags to support the subfolder requirement
  let outputDir = '.'
  if (mono) {
    outputDir = 'm' // Create or use 'm' subfolder for mono output
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
  } else if (stereo) {
    outputDir = 's' // Create or use 's' subfolder for stereo output
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
  }

  // Convert each audio file to the specified format
  const conversionPromises = audioFiles.map(async (audioFile, index) => {
    const inputExt = path.extname(audioFile).toLowerCase();
    const fileNameWithoutExt = path.basename(audioFile, inputExt);
    const outputFile = path.join(outputDir, `${fileNameWithoutExt}.${format}`);
    
    log(`Converting (${index + 1}/${audioFiles.length}): ${audioFile} -> ${outputFile}`)

    try {
      await convertAudioFile(audioFile, format, quality, mono, stereo, outputDir)
      log(`✓ Converted: ${audioFile} -> ${outputFile}`)
    } catch (error_) {
      error(`Failed to convert ${audioFile}: ${(error_ as Error).message}`)
    }
  })

  await Promise.all(conversionPromises)
}

export default class AudioConverterCommand extends Command {
  static description = 'Convert all audio files in the current directory to OGG, AAC/M4A, or FLAC format'
  static examples = [
    '<%= config.bin %>', // Convert all audio files to OGG with default quality
    '<%= config.bin %> -f ogg', // Convert to OGG format
    '<%= config.bin %> -f m4a -q 5', // Convert to M4A/AAC format
    '<%= config.bin %> -f flac -q 0', // Convert to FLAC format
    '<%= config.bin %> -q 8', // Convert to OGG with quality 8
    '<%= config.bin %> -f ogg -q 1', // Example with format and quality
    '<%= config.bin %> -m', // Convert to mono OGG with default quality, output to "m" subfolder
    '<%= config.bin %> -s -f m4a', // Convert to stereo M4A, output to "s" subfolder
  ]
  static flags = {
    format: Flags.string({
      char: 'f',
      default: 'ogg',
      description: 'Output format (ogg, m4a, flac)',
      options: ['ogg', 'm4a', 'flac'],
    }),
    quality: Flags.integer({
      char: 'q',
      default: 5,
      description: 'Quality setting (0-10, where 0 is highest quality and 10 is lowest)',
      max: 10,
      min: 0,
    }),
    stereo: Flags.boolean({
      char: 's',
      default: false,
      description: 'Force stereo output, output to "s" subfolder (default is to preserve original channel configuration)',
      exclusive: ['mono'], // Only one of stereo or mono can be specified
    }),
    mono: Flags.boolean({
      char: 'm',
      default: false,
      description: 'Force mono output, output to "m" subfolder (default is to preserve original channel configuration)',
      exclusive: ['stereo'], // Only one of mono or stereo can be specified
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(AudioConverterCommand)

    // Check if both mono and stereo flags are specified
    if (flags.mono && flags.stereo) {
      this.error('Cannot specify both mono and stereo flags. Please choose one or neither.')
    }

    this.log(`Searching for audio files in the current directory...`)
    this.log(`Output format: ${flags.format.toUpperCase()}`)
    this.log(`Quality setting: ${flags.quality} (0=highest, 10=lowest)`)

    // Check if ffmpeg is available
    if (!isFfmpegAvailable()) {
      this.error('ffmpeg could not be initialized. Please ensure your system supports the required binaries.')
    }

    // Find all audio files in the current directory
    const audioFiles = findAudioFiles('.')

    await convertMultipleAudioFiles(audioFiles, flags.format, flags.quality, flags.mono, flags.stereo, this.log.bind(this), this.error.bind(this))

    this.log('Conversion completed!')
  }
}