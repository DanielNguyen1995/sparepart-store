/**
 * Fields in a request to create a single part item.
 */
export interface CreatePartRequest {
    userId: string
    partNum: string
    make: string
    description: string
    vendorPartNum: string
    vendor: string
    inStock: number
    createdAt: string
    attachmentUrl?: string
  }
  