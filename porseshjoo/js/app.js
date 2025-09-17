// Porseshjoo Application JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeAuthModal();
    initializeQuestionCreator();
    initializeFormValidation();
    initializeResponsiveFeatures();
});

// Authentication Modal Functionality
function initializeAuthModal() {
    const signInBtn = document.getElementById('signInBtn');
    const modal = document.getElementById('authModal');
    const modalClose = document.getElementById('modalClose');
    const getStartedBtn = document.getElementById('getStartedBtn');

    if (signInBtn && modal) {
        signInBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }

    if (modalClose && modal) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    if (getStartedBtn && modal) {
        getStartedBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }

    // Handle social sign-in buttons (placeholder functionality)
    const googleBtn = document.querySelector('.btn-google');
    const appleBtn = document.querySelector('.btn-apple');

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            alert('Google Sign-In would be implemented here');
            // In a real app, this would redirect to Google OAuth
        });
    }

    if (appleBtn) {
        appleBtn.addEventListener('click', () => {
            alert('Apple Sign-In would be implemented here');
            // In a real app, this would redirect to Apple Sign-In
        });
    }
}

// Dynamic Question Creator Functionality
function initializeQuestionCreator() {
    const addMultipleChoiceBtn = document.getElementById('addMultipleChoice');
    const addOpenTextBtn = document.getElementById('addOpenText');
    const addRatingScaleBtn = document.getElementById('addRatingScale');
    const questionsContainer = document.getElementById('questionsContainer');
    const savePublishBtn = document.getElementById('savePublishBtn');
    const listTitleInput = document.getElementById('listTitle');

    let questionCounter = 0;

    if (addMultipleChoiceBtn && questionsContainer) {
        addMultipleChoiceBtn.addEventListener('click', () => {
            addQuestionBlock('multiple_choice');
        });
    }

    if (addOpenTextBtn && questionsContainer) {
        addOpenTextBtn.addEventListener('click', () => {
            addQuestionBlock('open_text');
        });
    }

    if (addRatingScaleBtn && questionsContainer) {
        addRatingScaleBtn.addEventListener('click', () => {
            addQuestionBlock('rating_scale');
        });
    }

    if (savePublishBtn) {
        savePublishBtn.addEventListener('click', () => {
            saveQuestionList();
        });
    }

    function addQuestionBlock(type) {
        questionCounter++;
        const questionBlock = document.createElement('div');
        questionBlock.className = 'question-block';
        questionBlock.dataset.type = type;
        questionBlock.dataset.id = questionCounter;

        const questionTypes = {
            'multiple_choice': 'Multiple Choice',
            'open_text': 'Open Text',
            'rating_scale': 'Rating Scale'
        };

        questionBlock.innerHTML = `
            <div class="question-header">
                <span class="question-type">Question ${questionCounter} - ${questionTypes[type]}</span>
                <button class="remove-btn" data-question-id="${questionCounter}">&times;</button>
            </div>
            <input
                type="text"
                class="question-input"
                placeholder="Enter your question here..."
                data-question-id="${questionCounter}"
            >
            <div class="options-container" data-question-id="${questionCounter}">
                ${getOptionsHTML(type, questionCounter)}
            </div>
        `;

        questionsContainer.appendChild(questionBlock);

        // Add event listener for remove button
        const removeBtn = questionBlock.querySelector('.remove-btn');
        removeBtn.addEventListener('click', (e) => {
            const questionId = e.target.dataset.questionId;
            removeQuestionBlock(questionId);
        });

        // Add event listeners for dynamic options (for multiple choice)
        if (type === 'multiple_choice') {
            const addOptionBtn = questionBlock.querySelector('.add-option-btn');
            if (addOptionBtn) {
                addOptionBtn.addEventListener('click', (e) => {
                    const questionId = e.target.dataset.questionId;
                    addMultipleChoiceOption(questionId);
                });
            }
        }
    }

    function getOptionsHTML(type, questionId) {
        switch (type) {
            case 'multiple_choice':
                return `
                    <div class="option-input">
                        <input type="text" placeholder="Option 1" data-option-id="1">
                        <button class="add-option-btn" data-question-id="${questionId}">+ Add Option</button>
                    </div>
                `;
            case 'open_text':
                return `
                    <p style="color: #64748b; font-style: italic;">
                        Respondents will be provided with a text box to write their answer.
                    </p>
                `;
            case 'rating_scale':
                return `
                    <p style="color: #64748b; font-style: italic;">
                        Respondents will rate on a scale from 1 to 5 (1 being lowest, 5 being highest).
                    </p>
                `;
            default:
                return '';
        }
    }

    function addMultipleChoiceOption(questionId) {
        const optionsContainer = document.querySelector(`.options-container[data-question-id="${questionId}"]`);
        const optionInputs = optionsContainer.querySelectorAll('.option-input');
        const newOptionNumber = optionInputs.length + 1;

        const optionInput = document.createElement('div');
        optionInput.className = 'option-input';
        optionInput.innerHTML = `
            <input type="text" placeholder="Option ${newOptionNumber}" data-option-id="${newOptionNumber}">
            <button class="remove-option-btn" data-option-id="${newOptionNumber}">&times;</button>
        `;

        // Insert before the "Add Option" button
        const addBtn = optionsContainer.querySelector('.add-option-btn');
        optionsContainer.insertBefore(optionInput, addBtn);

        // Add event listener for remove option
        const removeOptionBtn = optionInput.querySelector('.remove-option-btn');
        removeOptionBtn.addEventListener('click', (e) => {
            const optionId = e.target.dataset.optionId;
            removeMultipleChoiceOption(questionId, optionId);
        });
    }

    function removeMultipleChoiceOption(questionId, optionId) {
        const optionsContainer = document.querySelector(`.options-container[data-question-id="${questionId}"]`);
        const optionToRemove = optionsContainer.querySelector(`input[data-option-id="${optionId}"]`);
        if (optionToRemove && optionToRemove.parentElement) {
            optionToRemove.parentElement.remove();
        }
    }

    function removeQuestionBlock(questionId) {
        const questionBlock = document.querySelector(`.question-block[data-id="${questionId}"]`);
        if (questionBlock) {
            questionBlock.remove();
            // Renumber remaining questions
            updateQuestionNumbers();
        }
    }

    function updateQuestionNumbers() {
        const questionBlocks = document.querySelectorAll('.question-block');
        questionBlocks.forEach((block, index) => {
            const questionNumber = index + 1;
            const typeSpan = block.querySelector('.question-type');
            const typeText = typeSpan.textContent.split(' - ')[1];
            typeSpan.textContent = `Question ${questionNumber} - ${typeText}`;

            block.dataset.id = questionNumber;
            const inputs = block.querySelectorAll('input, .options-container, .remove-btn');
            inputs.forEach(input => {
                if (input.dataset.questionId) {
                    input.dataset.questionId = questionNumber;
                }
            });
        });
        questionCounter = questionBlocks.length;
    }

    function saveQuestionList() {
        const title = listTitleInput ? listTitleInput.value.trim() : '';
        if (!title) {
            alert('Please enter a title for your question list.');
            return;
        }

        const questions = [];
        const questionBlocks = document.querySelectorAll('.question-block');

        if (questionBlocks.length === 0) {
            alert('Please add at least one question to your list.');
            return;
        }

        questionBlocks.forEach((block, index) => {
            const questionId = block.dataset.id;
            const questionInput = block.querySelector('.question-input');
            const questionText = questionInput ? questionInput.value.trim() : '';

            if (!questionText) {
                alert(`Please enter text for Question ${index + 1}.`);
                return;
            }

            const question = {
                id: questionId,
                text: questionText,
                type: block.dataset.type
            };

            // Collect options for multiple choice questions
            if (block.dataset.type === 'multiple_choice') {
                const options = [];
                const optionInputs = block.querySelectorAll('.option-input input[type="text"]');
                optionInputs.forEach(input => {
                    const optionText = input.value.trim();
                    if (optionText) {
                        options.push(optionText);
                    }
                });
                question.options = options;

                if (options.length < 2) {
                    alert(`Question ${index + 1} needs at least 2 options.`);
                    return;
                }
            }

            questions.push(question);
        });

        const questionList = {
            title: title,
            questions: questions,
            createdAt: new Date().toISOString()
        };

        // In a real application, this would be sent to a backend API
        console.log('Saving question list:', questionList);
        alert('Question list saved successfully! (This is a demo - in a real app, this would be saved to a database)');

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

// Form Validation and Enhancement
function initializeFormValidation() {
    // Add validation for the public question list form
    const questionsForm = document.getElementById('questionsForm');
    if (questionsForm) {
        questionsForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation - ensure required questions are answered
            const requiredQuestions = questionsForm.querySelectorAll('.question-item');
            let allAnswered = true;

            requiredQuestions.forEach((question, index) => {
                const inputs = question.querySelectorAll('input[type="radio"], input[type="text"], textarea');
                const hasAnswer = Array.from(inputs).some(input => {
                    if (input.type === 'radio') {
                        return input.checked;
                    } else {
                        return input.value.trim() !== '';
                    }
                });

                if (!hasAnswer) {
                    allAnswered = false;
                    question.style.borderColor = '#dc2626';
                } else {
                    question.style.borderColor = '#e1e5e9';
                }
            });

            if (!allAnswered) {
                alert('Please answer all questions before submitting.');
                return;
            }

            // Collect form data
            const formData = new FormData(questionsForm);
            const responses = {};

            for (let [key, value] of formData.entries()) {
                responses[key] = value;
            }

            console.log('Form responses:', responses);
            alert('Thank you for your responses! (This is a demo - in a real app, responses would be saved to a database)');

            // In a real app, you might redirect to a thank you page
        });
    }
}

// Responsive Features
function initializeResponsiveFeatures() {
    // Handle mobile menu if needed
    // Handle touch events for better mobile experience

    // Add visual feedback for button interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.98)';
        });

        button.addEventListener('touchend', () => {
            button.style.transform = 'scale(1)';
        });
    });
}

// Utility Functions
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Export functions for potential use in other scripts
window.PorseshjooApp = {
    initializeAuthModal,
    initializeQuestionCreator,
    initializeFormValidation,
    initializeResponsiveFeatures
};
