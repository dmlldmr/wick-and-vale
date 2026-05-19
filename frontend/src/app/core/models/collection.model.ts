// VariantInfo modeli (backend'deki VariantInfo'ya karşılık)
export interface VariantInfo {
  id: number;
  variantType: string; // SADE, DESENLI, INCE, KALIN, KAGIT, TENEKE
}

// Create Collection Request
export interface CreateCollectionRequest {
  collectionType: string;
  description?: string | null;
  coverImage?: string;
}

// Update Collection Request
export interface UpdateCollectionRequest {
  collectionType?: string;
  description?: string | null;
  coverImage?: string;
}

// Collection Response (Backend'den gelen)
export interface Collection {
  id: number;
  collectionType: string;
  description: string | null;
  coverImage: string;
  variants: VariantInfo[]; // Bu alan eklendi!
  createdAt: string;
  updatedAt: string;
}
