export class MemorySystem {
    constructor() {
        this.kv = typeof puter !== 'undefined' ? puter.kv : null;
    }

    async saveEpisodic(key, value) {
        if (!this.kv) return;
        const timestamp = new Date().toISOString();
        const entry = { timestamp, value };
        await this.kv.set(`episodic:${key}:${timestamp}`, JSON.stringify(entry));
    }

    async saveProcedural(workflowName, steps) {
        if (!this.kv) return;
        await this.kv.set(`procedural:${workflowName}`, JSON.stringify(steps));
    }

    async getProcedural(workflowName) {
        if (!this.kv) return null;
        const data = await this.kv.get(`procedural:${workflowName}`);
        return data ? JSON.parse(data) : null;
    }

    async longTermSearch(query) {
        if (!this.kv) return [];
        const keys = await this.kv.list();
        const results = [];
        for (const key of keys) {
            if (key.startsWith('episodic:')) {
                const val = await this.kv.get(key);
                if (val && val.includes(query)) {
                    results.push(JSON.parse(val));
                }
            }
        }
        return results;
    }
}
