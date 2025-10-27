/* eslint-disable unicorn/import-style */
import {Command, Flags} from '@oclif/core'
import {spawn, spawnSync} from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'

// Function to check if ffmpeg is available
const isFfmpegAvailable = (): boolean => {
  try {
    // Use 'where' on Windows to check if ffmpeg exists in PATH
    if (process.platform === 'win32') {
      const result = spawnSync('where', ['ffmpeg'], {stdio: 'pipe'})
      return result.status === 0
    }

    const result = spawnSync('which', ['ffmpeg'], {stdio: 'pipe'})
    return result.status === 0
  } catch {
    try {
      // Fallback: try running ffmpeg directly
      const result = spawnSync('ffmpeg', ['-version'], {stdio: 'pipe'})
      return result.status === 0
    } catch {
      return false
    }
  }
}

// Function to find all MP3 files in a directory
const findMp3Files = (dir: string): string[] => {
  const files = fs.readdirSync(dir)
  return files.filter((file) => file.toLowerCase().endsWith('.mp3') && fs.statSync(path.join(dir, file)).isFile())
}

// Function to convert an MP3 file to the specified format using ffmpeg
const convertMp3ToFile = (mp3File: string, format: string, quality: number): Promise<void> =>
  new Promise((resolve, reject) => {
    let outputFile = mp3File.replace(/\.mp3$/i, `.${format}`);
    
    // Map format names to appropriate ffmpeg codecs and quality parameters
    let qualityFlag = '';
    let qualityValue = '';
    
    switch (format) {
      case 'ogg':
        qualityFlag = '-q:a';
        qualityValue = quality.toString(); // For ogg, quality is 0-10 (0=highest, 10=lowest)
        break;
      case 'm4a':
        qualityFlag = '-b:a'; // Bitrate for aac
        // Map quality (0-10) to bitrate (kbps) - higher quality = higher bitrate
        const bitrate = Math.max(64, 320 - (quality * 24)); // Maps to ~64-320 kbps range
        qualityValue = `${bitrate}k`;
        break;
      case 'flac':
        qualityFlag = '-compression_level';
        // For flac, use quality value directly (0-12) but map the range 0-10 to appropriate FLAC levels
        qualityValue = Math.min(12, quality).toString(); // FLAC compression level 0-12
        break;
      default:
        reject(new Error(`Unsupported format: ${format}`));
        return;
    }

    // Use ffmpeg to convert MP3 to the specified format with quality settings
    const ffmpegProcess = spawn('ffmpeg', ['-i', mp3File, qualityFlag, qualityValue, outputFile, '-y'], {
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
        reject(new Error(`ffmpeg exited with code ${code}. Conversion failed for ${mp3File}`))
      }
    })

    ffmpegProcess.on('error', (error) => {
      reject(new Error(`FFmpeg process error: ${error.message}`))
    })
  })

// Function to convert multiple MP3 files to the specified format
const convertMultipleMp3ToFile = async (
  mp3Files: string[],
  format: string,
  quality: number,
  log: (message: string) => void,
  error: (message: string) => void,
): Promise<void> => {
  if (mp3Files.length === 0) {
    log('No MP3 files found in the current directory.')
    return
  }

  log(`Found ${mp3Files.length} MP3 file(s) to convert to ${format.toUpperCase()}.`)

  // Convert each MP3 file to the specified format
  const conversionPromises = mp3Files.map(async (mp3File, index) => {
    const outputFile = mp3File.replace(/\.mp3$/i, `.${format}`);
    log(`Converting (${index + 1}/${mp3Files.length}): ${mp3File} -> ${outputFile}`)

    try {
      await convertMp3ToFile(mp3File, format, quality)
      log(`✓ Converted: ${mp3File} -> ${outputFile}`)
    } catch (error_) {
      error(`Failed to convert ${mp3File}: ${(error_ as Error).message}`)
    }
  })

  await Promise.all(conversionPromises)
}

export default class Convert extends Command {
  static description = 'Convert all MP3 files in the current directory to OGG, AAC/M4A, or FLAC format'
  static examples = [
    '<%= config.bin %> <%= command.id %>', // Convert all MP3 files to OGG with default quality
    '<%= config.bin %> <%= command.id %> --format ogg', // Convert to OGG format
    '<%= config.bin %> <%= command.id %> --format m4a --quality 5', // Convert to M4A/AAC format
    '<%= config.bin %> <%= command.id %> --format flac --quality 0', // Convert to FLAC format
    '<%= config.bin %> <%= command.id %> --quality 8', // Convert to OGG with quality 8
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
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Convert)

    this.log(`Searching for MP3 files in the current directory...`)
    this.log(`Output format: ${flags.format.toUpperCase()}`)
    this.log(`Quality setting: ${flags.quality} (0=highest, 10=lowest)`)

    // Check if ffmpeg is available
    if (!isFfmpegAvailable()) {
      this.error('ffmpeg is not available in your system. Please install ffmpeg first.')
    }

    // Find all MP3 files in the current directory
    const mp3Files = findMp3Files('.')

    await convertMultipleMp3ToFile(mp3Files, flags.format, flags.quality, this.log.bind(this), this.error.bind(this))

    this.log('Conversion completed!')
  }
}
