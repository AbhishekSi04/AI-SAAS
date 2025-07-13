export interface Video {
    id: string;
    title: string;
    description?: string;
    publicId: string;
    originalSize: string;
    compressedSize: string;
    duration: number;
    status: 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
}

export interface Image {
    id: string;
    title?: string;
    description?: string;
    publicId: string;
    secureUrl: string;
    type: 'UPLOADED' | 'GENERATED' | 'TRANSFORMED' | 'BACKGROUND_REMOVED' | 'EXTENDED';
    createdAt: string;
    updatedAt: string;
}

export interface CreditLog {
    id: string;
    amount: number;
    type: 'PURCHASE' | 'USAGE';
    description: string;
    createdAt: string;
    metadata?: Record<string, unknown>;
}

export interface DatabaseUser {
    id: string;
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    credits: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}