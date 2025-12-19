

export interface ApiResponse<T = unknown> {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
}

export interface PaginationMetadata {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    first: boolean;
    last: boolean;
}

export interface PaginatedData<T> {
    items: T[];
    metadata: PaginationMetadata;
}