export type ActionState = {
    success: boolean;
    error: string | null;
    fieldErrors: Record<string, string[]> | null;
};