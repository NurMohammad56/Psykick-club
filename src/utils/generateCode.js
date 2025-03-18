export const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {

        if (i === 3) {
            result += '-';
        }

        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}