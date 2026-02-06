// Wizard State Management
class RiskAssessmentWizard {
    constructor() {
        // Configuration - will be loaded from server
        this.webhookUrl = '';

        // State
        this.currentPage = 'welcome';
        this.currentCategoryIndex = 0;
        this.answers = {};
        this.email = '';
        this.clientId = '';

        // Initialize
        this.init();
    }

    async init() {
        await this.loadConfig();
        this.parseUrlParams();
        this.initializeAnswers();
        this.renderProgressSteps();
        this.bindEvents();
        this.updateUI();
    }

    async loadConfig() {
        try {
            const response = await fetch('/api/config');
            const config = await response.json();
            this.webhookUrl = config.webhookUrl;
            console.log('Webhook URL loaded:', this.webhookUrl);
        } catch (error) {
            console.error('Failed to load config, using default:', error);
            this.webhookUrl = 'http://localhost:5678/webhook/risk-assessment';
        }
    }

    parseUrlParams() {
        const params = new URLSearchParams(window.location.search);
        this.email = params.get('email') || '';
        this.clientId = params.get('ClientID') || '';

        const emailDisplay = document.getElementById('userEmail');
        if (this.email) {
            emailDisplay.textContent = this.email;
        } else {
            emailDisplay.textContent = 'No email provided';
            emailDisplay.style.color = '#ef4444';
        }
    }

    initializeAnswers() {
        ASSESSMENT_CATEGORIES.forEach(category => {
            category.questions.forEach(question => {
                this.answers[question.id] = null;
            });
        });
    }

    renderProgressSteps() {
        const container = document.getElementById('progressSteps');
        const steps = [
            { id: 'welcome', label: 'Start' },
            ...ASSESSMENT_CATEGORIES.map((cat, i) => ({ id: `category-${i}`, label: cat.title })),
            { id: 'review', label: 'Review' }
        ];

        container.innerHTML = steps.map((step, index) => `
            <div class="progress-step ${index === 0 ? 'active' : 'disabled'}" data-step="${step.id}">
                <div class="step-indicator">${index + 1}</div>
                <span class="step-label">${step.label}</span>
            </div>
        `).join('');

        // Bind click events to progress steps
        container.querySelectorAll('.progress-step').forEach((stepEl, index) => {
            stepEl.addEventListener('click', () => this.goToStep(index));
        });
    }

    goToStep(stepIndex) {
        const steps = this.getStepsList();
        const stepInfo = steps[stepIndex];

        if (!stepInfo || stepInfo.disabled) return;

        if (stepInfo.id === 'welcome') {
            this.currentPage = 'welcome';
        } else if (stepInfo.id === 'review') {
            this.currentPage = 'review';
        } else if (stepInfo.id.startsWith('category-')) {
            this.currentPage = 'category';
            this.currentCategoryIndex = parseInt(stepInfo.id.split('-')[1]);
        }

        this.updateUI();
    }

    getStepsList() {
        const steps = [
            { id: 'welcome', disabled: false }
        ];

        ASSESSMENT_CATEGORIES.forEach((cat, i) => {
            // A category is accessible if all previous categories are complete or it's the first one
            const isAccessible = i === 0 || this.isCategoryComplete(i - 1);
            steps.push({ id: `category-${i}`, disabled: !isAccessible });
        });

        // Review is accessible if all categories are complete
        const allComplete = ASSESSMENT_CATEGORIES.every((_, i) => this.isCategoryComplete(i));
        steps.push({ id: 'review', disabled: !allComplete });

        return steps;
    }

    isCategoryComplete(categoryIndex) {
        const category = ASSESSMENT_CATEGORIES[categoryIndex];
        return category.questions.every(q => this.answers[q.id] !== null);
    }

    bindEvents() {
        document.getElementById('btnPrev').addEventListener('click', () => this.handlePrev());
        document.getElementById('btnNext').addEventListener('click', () => this.handleNext());
    }

    handlePrev() {
        if (this.currentPage === 'category' && this.currentCategoryIndex > 0) {
            this.currentCategoryIndex--;
        } else if (this.currentPage === 'category' && this.currentCategoryIndex === 0) {
            this.currentPage = 'welcome';
        } else if (this.currentPage === 'review') {
            this.currentPage = 'category';
            this.currentCategoryIndex = ASSESSMENT_CATEGORIES.length - 1;
        }
        this.updateUI();
    }

    handleNext() {
        if (this.currentPage === 'welcome') {
            this.currentPage = 'category';
            this.currentCategoryIndex = 0;
        } else if (this.currentPage === 'category') {
            if (this.currentCategoryIndex < ASSESSMENT_CATEGORIES.length - 1) {
                this.currentCategoryIndex++;
            } else {
                this.currentPage = 'review';
            }
        } else if (this.currentPage === 'review') {
            this.submitAssessment();
        }
        this.updateUI();
    }

    updateUI() {
        this.updatePages();
        this.updateProgressBar();
        this.updateProgressSteps();
        this.updateNavButtons();
    }

    updatePages() {
        // Hide all pages
        document.querySelectorAll('.wizard-page').forEach(page => {
            page.classList.remove('active');
        });

        // Show current page
        if (this.currentPage === 'welcome') {
            document.getElementById('page-welcome').classList.add('active');
        } else if (this.currentPage === 'category') {
            this.renderCategoryPage();
            document.getElementById('page-category').classList.add('active');
        } else if (this.currentPage === 'review') {
            this.renderReviewPage();
            document.getElementById('page-review').classList.add('active');
        } else if (this.currentPage === 'submitting') {
            document.getElementById('page-submitting').classList.add('active');
        } else if (this.currentPage === 'complete') {
            this.renderCompletePage();
            document.getElementById('page-complete').classList.add('active');
        }
    }

    updateProgressBar() {
        const totalSteps = ASSESSMENT_CATEGORIES.length + 2; // welcome + categories + review
        let currentStep = 0;

        if (this.currentPage === 'welcome') {
            currentStep = 0;
        } else if (this.currentPage === 'category') {
            currentStep = this.currentCategoryIndex + 1;
        } else if (this.currentPage === 'review' || this.currentPage === 'submitting' || this.currentPage === 'complete') {
            currentStep = totalSteps - 1;
        }

        const progress = ((currentStep + 1) / totalSteps) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    updateProgressSteps() {
        const steps = this.getStepsList();
        const stepElements = document.querySelectorAll('.progress-step');

        let currentStepIndex = 0;
        if (this.currentPage === 'welcome') {
            currentStepIndex = 0;
        } else if (this.currentPage === 'category') {
            currentStepIndex = this.currentCategoryIndex + 1;
        } else if (this.currentPage === 'review' || this.currentPage === 'submitting' || this.currentPage === 'complete') {
            currentStepIndex = steps.length - 1;
        }

        stepElements.forEach((el, index) => {
            el.classList.remove('active', 'completed', 'disabled');

            if (index < currentStepIndex) {
                el.classList.add('completed');
            } else if (index === currentStepIndex) {
                el.classList.add('active');
            } else if (steps[index].disabled) {
                el.classList.add('disabled');
            }
        });
    }

    updateNavButtons() {
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');

        // Previous button
        if (this.currentPage === 'welcome' || this.currentPage === 'submitting' || this.currentPage === 'complete') {
            btnPrev.disabled = true;
        } else {
            btnPrev.disabled = false;
        }

        // Next button
        if (this.currentPage === 'welcome') {
            btnNext.innerHTML = `Get Started <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            btnNext.disabled = false;
            btnNext.className = 'btn btn-primary';
        } else if (this.currentPage === 'category') {
            const isComplete = this.isCategoryComplete(this.currentCategoryIndex);
            const isLast = this.currentCategoryIndex === ASSESSMENT_CATEGORIES.length - 1;

            if (isLast) {
                btnNext.innerHTML = `Review Answers <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            } else {
                btnNext.innerHTML = `Next Category <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            }
            btnNext.disabled = !isComplete;
            btnNext.className = 'btn btn-primary';
        } else if (this.currentPage === 'review') {
            btnNext.innerHTML = `Submit Assessment <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            btnNext.disabled = false;
            btnNext.className = 'btn btn-success';
        } else if (this.currentPage === 'submitting' || this.currentPage === 'complete') {
            btnNext.style.display = 'none';
            btnPrev.style.display = 'none';
        }

        // Show buttons if they were hidden
        if (this.currentPage !== 'submitting' && this.currentPage !== 'complete') {
            btnNext.style.display = '';
            btnPrev.style.display = '';
        }
    }

    renderCategoryPage() {
        const category = ASSESSMENT_CATEGORIES[this.currentCategoryIndex];
        const answeredCount = category.questions.filter(q => this.answers[q.id] !== null).length;

        const container = document.getElementById('page-category');
        container.innerHTML = `
            <div class="category-hero">
                <img src="${category.headerImage}" alt="${category.title}" class="category-hero-image">
            </div>
            <div class="category-header">
                <h2>This section measures ${category.title}</h2>
                <p class="category-description">${category.description}</p>
                <p class="category-progress">${answeredCount} of ${category.questions.length} questions answered</p>
            </div>
            <div class="questions-list">
                ${category.questions.map((question, qIndex) => this.renderQuestion(question, qIndex)).join('')}
            </div>
            <div class="category-footer">
                <p>${category.footerNote}</p>
            </div>
        `;

        // Bind score option events
        container.querySelectorAll('.score-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const questionId = option.dataset.questionId;
                const score = parseInt(option.dataset.score);
                this.setAnswer(questionId, score);
            });
        });
    }

    renderQuestion(question, index) {
        const currentAnswer = this.answers[question.id];
        const isAnswered = currentAnswer !== null;

        return `
            <div class="question-card ${isAnswered ? 'answered' : ''}">
                <div class="question-number">Question ${index + 1}</div>
                <div class="question-text">${question.text}</div>
                <div class="score-options">
                    ${SCORE_OPTIONS.map(option => `
                        <div class="score-option ${currentAnswer === option.value ? 'selected' : ''}"
                             data-question-id="${question.id}"
                             data-score="${option.value}">
                            <span class="score-badge score-${option.value}">${option.value}</span>
                            <span class="score-option-label">${option.label}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    setAnswer(questionId, score) {
        this.answers[questionId] = score;
        this.updateUI();
    }

    renderReviewPage() {
        const container = document.getElementById('reviewCategories');

        container.innerHTML = ASSESSMENT_CATEGORIES.map((category, catIndex) => {
            const categoryScore = this.getCategoryScore(catIndex);
            const maxScore = category.questions.length * 3;

            return `
                <div class="review-category" data-category-index="${catIndex}">
                    <div class="review-category-header">
                        <span class="review-category-title">${category.title}</span>
                        <div class="review-category-score">
                            <span class="score-value ${this.getRiskClass(categoryScore, maxScore)}">${categoryScore}</span>
                            <span class="score-max">/ ${maxScore}</span>
                        </div>
                    </div>
                    <div class="review-questions">
                        ${category.questions.map(question => `
                            <div class="review-question">
                                <span class="review-question-text">${question.text}</span>
                                <span class="review-question-score">
                                    <span class="score-badge score-${this.answers[question.id]}">${this.answers[question.id]}</span>
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Bind click to edit
        container.querySelectorAll('.review-category').forEach(el => {
            el.addEventListener('click', () => {
                const catIndex = parseInt(el.dataset.categoryIndex);
                this.currentPage = 'category';
                this.currentCategoryIndex = catIndex;
                this.updateUI();
            });
        });
    }

    getCategoryScore(categoryIndex) {
        const category = ASSESSMENT_CATEGORIES[categoryIndex];
        return category.questions.reduce((sum, q) => sum + (this.answers[q.id] || 0), 0);
    }

    getTotalScore() {
        return Object.values(this.answers).reduce((sum, score) => sum + (score || 0), 0);
    }

    getRiskClass(score, maxScore) {
        const percentage = score / maxScore;
        if (percentage < 0.33) return 'risk-low';
        if (percentage < 0.66) return 'risk-medium';
        return 'risk-high';
    }

    renderCompletePage() {
        const container = document.getElementById('completeSummary');
        const totalScore = this.getTotalScore();
        const maxScore = 30 * 3; // 30 questions × 3 max points

        container.innerHTML = `
            ${ASSESSMENT_CATEGORIES.map(category => {
                const categoryScore = this.getCategoryScore(ASSESSMENT_CATEGORIES.indexOf(category));
                const catMaxScore = category.questions.length * 3;
                return `
                    <div class="summary-item">
                        <span class="summary-label">${category.title}</span>
                        <span class="summary-value ${this.getRiskClass(categoryScore, catMaxScore)}">${categoryScore} / ${catMaxScore}</span>
                    </div>
                `;
            }).join('')}
            <div class="summary-total">
                <span class="summary-label">Total Risk Score</span>
                <span class="summary-value">${totalScore} / ${maxScore}</span>
            </div>
        `;
    }

    async submitAssessment() {
        this.currentPage = 'submitting';
        this.updateUI();

        // Build answers with question text as keys
        const answersWithText = {};
        ASSESSMENT_CATEGORIES.forEach(category => {
            category.questions.forEach(q => {
                answersWithText[q.text] = this.answers[q.id];
            });
        });

        // Build payload
        const payload = {
            email: this.email,
            clientId: this.clientId,
            timestamp: new Date().toISOString(),
            answers: answersWithText,
            categoryScores: {},
            totalScore: this.getTotalScore(),
            maxScore: 90
        };

        // Add category scores
        ASSESSMENT_CATEGORIES.forEach((category, index) => {
            payload.categoryScores[category.id] = {
                score: this.getCategoryScore(index),
                maxScore: 15,
                questions: {}
            };
            category.questions.forEach(q => {
                payload.categoryScores[category.id].questions[q.id] = {
                    score: this.answers[q.id],
                    text: q.text
                };
            });
        });

        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Success
            this.currentPage = 'complete';
            this.updateUI();
        } catch (error) {
            console.error('Submission error:', error);
            // For demo purposes, show complete page even on error
            // In production, you might want to show an error message
            this.currentPage = 'complete';
            this.updateUI();
        }
    }
}

// Initialize wizard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.wizard = new RiskAssessmentWizard();
});
