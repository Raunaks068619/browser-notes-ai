/**
 * Chrome-specific File System Access API extensions
 * These methods are not in the standard DOM types but exist in Chrome
 */
export { };

interface FileSystemPermissionDescriptor {
    mode?: "read" | "readwrite";
}

declare global {
    interface FileSystemHandle {
        queryPermission(descriptor?: FileSystemPermissionDescriptor): Promise<PermissionState>;
        requestPermission(descriptor?: FileSystemPermissionDescriptor): Promise<PermissionState>;
    }

    interface Window {
        showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
    }
}
