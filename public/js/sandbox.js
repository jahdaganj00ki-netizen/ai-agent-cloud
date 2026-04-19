export class CloudSandbox {
    constructor() {
        this.apiEndpoint = 'https://emkc.org/api/v2/piston/execute';
    }

    async executeCode(language, sourceCode) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: language,
                    version: '*',
                    files: [{ content: sourceCode }]
                })
            });

            const result = await response.json();
            return result.run ? result.run.output : 'Execution failed';
        } catch (e) {
            console.error("Sandbox execution error:", e);
            return `Execution failed: ${e.message}`;
        }
    }
}
