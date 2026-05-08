export interface Collection {
  id: number;
  collectionType: string;
  description: string;
  coverImage: string;
  variants: {id: number; variantType: string}[];
  createdAt: string;
}

export interface CreateCollectionRequest {
  collectionType: string;
  description: string;
  coverImage: string;
}

export interface UpdateCollectionRequest {
  description: string;
  coverImage: string;
}
