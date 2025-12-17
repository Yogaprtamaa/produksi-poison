// utils/PoissonAnalyzer.js

// PARENT CLASS (OOP Basic)
class MathStats {
    constructor() {
        this.euler = Math.E; // Konstanta Euler (2.718...)
    }

    // Fungsi faktorial (misal 3! = 3*2*1)
    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    }
}

// CHILD CLASS (Inheritance)
class PoissonAnalyzer extends MathStats {
    constructor(logs) {
        super();
        this.logs = logs;
        this.lambda = this.calculateLambda();
    }

    calculateLambda() {
        if (!this.logs || this.logs.length === 0) return 0;
        const totalDefects = this.logs.reduce((sum, log) => sum + log.defect_count, 0);
        return totalDefects / this.logs.length;
    }

    // RUMUS POISSON (Matematika)
    calculateProbability(k) {
        const numerator = Math.pow(this.euler, -this.lambda) * Math.pow(this.lambda, k);
        const denominator = this.factorial(k);
        return (numerator / denominator * 100).toFixed(1); 
    }

    getAnalysis() {
        let predictions = [];
        // Hitung peluang cacat 0 sampai 5
        for (let i = 0; i <= 5; i++) {
            predictions.push({ count: i, chance: this.calculateProbability(i) });
        }
        return { lambda: this.lambda.toFixed(2), predictions };
    }
}

module.exports = PoissonAnalyzer;