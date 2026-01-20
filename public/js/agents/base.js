export class BaseAgent {
    constructor(name, role) {
        this.name = name;
        this.role = role;
    }

    async chat(prompt, model = 'gpt-4o') {
        try {
            const response = await puter.ai.chat(prompt, { model });
            return response.toString();
        } catch (error) {
            console.error(`Error in agent ${this.name}:`, error);
            if (error.message && error.message.includes('not signed in')) {
                await puter.auth.signIn();
                const response = await puter.ai.chat(prompt, { model });
                return response.toString();
            }
            throw error;
        }
    }
}
