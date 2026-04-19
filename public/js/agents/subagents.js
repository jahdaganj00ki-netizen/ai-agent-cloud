import { BaseAgent } from './base.js';

export class ResearchAgent extends BaseAgent {
    constructor() { super('Research', 'Researcher'); }
    async execute(step, project) {
        return await this.chat(`Research: ${step.description}`);
    }
}

export class PlanningAgent extends BaseAgent {
    constructor() { super('Planning', 'Planner'); }
    async execute(step, project) {
        return await this.chat(`Plan: ${step.description}`);
    }
}

export class CodeGenerationAgent extends BaseAgent {
    constructor() { super('CodeGeneration', 'Developer'); }
    async execute(step, project) {
        const code = await this.chat(`Generate code for: ${step.description}`);
        project.files['generated_code.js'] = code;
        return "Code generated.";
    }
}

export class CodeReviewAgent extends BaseAgent {
    constructor() { super('CodeReview', 'Reviewer'); }
    async execute(step, project) {
        return await this.chat(`Review: ${JSON.stringify(project.files)}`);
    }
}

export class DebuggingAgent extends BaseAgent {
    constructor() { super('Debugging', 'Debugger'); }
    async execute(step, project) {
        return await this.chat(`Debug: ${JSON.stringify(project.files)}`);
    }
}

export class TestAgent extends BaseAgent {
    constructor() { super('Test', 'Tester'); }
    async execute(step, project) {
        return await this.chat(`Test: ${JSON.stringify(project.files)}`);
    }
}

export class SecurityAgent extends BaseAgent {
    constructor() { super('Security', 'Security Expert'); }
    async execute(step, project) {
        return await this.chat(`Security: ${JSON.stringify(project.files)}`);
    }
}

export class UIUXAgent extends BaseAgent {
    constructor() { super('UIUX', 'Designer'); }
    async execute(step, project) {
        return await this.chat(`UI/UX: ${project.request}`);
    }
}

export class DatabaseAgent extends BaseAgent {
    constructor() { super('Database', 'DB Admin'); }
    async execute(step, project) {
        return await this.chat(`Database: ${project.request}`);
    }
}

export class DeploymentAgent extends BaseAgent {
    constructor() { super('Deployment', 'DevOps'); }
    async execute(step, project) {
        return await this.chat(`Deployment: ${project.request}`);
    }
}

export class DocumentationAgent extends BaseAgent {
    constructor() { super('Documentation', 'Technical Writer'); }
    async execute(step, project) {
        return await this.chat(`Documentation: ${JSON.stringify(project.files)}`);
    }
}
