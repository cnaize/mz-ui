// From here:
// https://stackblitz.com/edit/typescript-encode-decode-base64
export class Base64 {
    public static Encode(str: string) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
                return String.fromCharCode(('0x' + p1) as any);
            }));
    }

    public static Decode(str: string) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
}
