export interface UploadResult {
  url: string;
  publicId?: string;
  provider: 'local' | 'cloudinary' | 's3';
}

export class StorageService {
  /**
   * Upload an image file / buffer or validate a public image URL
   */
  public static async uploadImage(
    imageData: string,
    folder: string = 'jharna-clinic'
  ): Promise<UploadResult> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // If Cloudinary configured, upload via Cloudinary REST API
    if (cloudName && apiKey && apiSecret && imageData.startsWith('data:image')) {
      try {
        const formData = new URLSearchParams();
        formData.append('file', imageData);
        formData.append('upload_preset', 'ml_default');
        formData.append('folder', folder);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        const data = await response.json();
        if (data.secure_url) {
          return {
            url: data.secure_url,
            publicId: data.public_id,
            provider: 'cloudinary',
          };
        }
      } catch (err) {
        console.warn('Cloudinary upload fallback to direct URL:', err);
      }
    }

    // Direct HTTP/HTTPS Image URL pass-through or sanitized base64/placeholder
    if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
      return {
        url: imageData,
        provider: 'local',
      };
    }

    // Default clean fallback
    return {
      url: imageData,
      provider: 'local',
    };
  }
}
