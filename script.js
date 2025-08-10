// Configuration data
const ADJECTIVES = {
    Bass: ['Deep', 'Sub', 'Heavy', 'Rumbling', 'Punchy', 'Fat', 'Rolling', 'Warm', 'Thick', 'Resonant'],
    Lead: ['Sharp', 'Bright', 'Cutting', 'Soaring', 'Piercing', 'Electric', 'Dynamic', 'Bold', 'Screaming'],
    Pluck: ['Crisp', 'Snappy', 'Quick', 'Percussive', 'Bouncy', 'Staccato', 'Clean', 'Tight', 'Elastic'],
    Synth: ['Analog', 'Digital', 'Warm', 'Cold', 'Modular', 'Vintage', 'Modern', 'Processed', 'Wavy'],
    Pad: ['Warm', 'Lush', 'Atmospheric', 'Dreamy', 'Ethereal', 'Floating', 'Smooth', 'Ambient', 'Evolving'],
    Keys: ['Vintage', 'Electric', 'Acoustic', 'Rhodes', 'Warm', 'Bright', 'Mellow', 'Classic', 'Jazzy'],
    Kick: ['Punchy', 'Boomy', 'Tight', 'Deep', 'Thumping', 'Heavy', 'Clean', 'Solid', 'Thuddy'],
    Snare: ['Snappy', 'Crisp', 'Fat', 'Rimshot', 'Clappy', 'Tight', 'Poppy', 'Sharp', 'Woody'],
    HiHat: ['Crisp', 'Sizzling', 'Bright', 'Sharp', 'Clean', 'Metallic', 'Light', 'Airy', 'Trashy'],
    OpenHat: ['Splashy', 'Bright', 'Washing', 'Metallic', 'Sustained', 'Shimmering', 'Wide', 'Decay'],
    Perc: ['Organic', 'Tribal', 'Ethnic', 'Rhythmic', 'Natural', 'Textured', 'Raw', 'Wooden'],
    Loop: ['Hypnotic', 'Driving', 'Groovy', 'Rolling', 'Cyclic', 'Repetitive', 'Flowing', 'Endless'],
    OneShot: ['Impact', 'Hit', 'Stab', 'Accent', 'Punctual', 'Sharp', 'Quick', 'Single'],
    Vocal: ['Chopped', 'Pitched', 'Processed', 'Ethereal', 'Human', 'Melodic', 'Textured', 'Soulful'],
    FX: ['Sweep', 'Rise', 'Impact', 'Glitch', 'Reversed', 'Filtered', 'Modulated', 'Whoosh']
};

const BPM_GENRES = {
    70: ['Downtempo', 'Trip-Hop', 'Lo-Fi'],
    80: ['Hip-Hop', 'Boom-Bap', 'Trap'],
    90: ['R&B', 'Neo-Soul', 'Trap'],
    100: ['Pop', 'Electro', 'Future-Bass'],
    110: ['House', 'Deep-House', 'Tech-House'],
    120: ['House', 'Techno', 'Progressive'],
    130: ['Techno', 'Trance', 'Hard-House'],
    140: ['Techno', 'Dubstep', 'Breaks'],
    150: ['Hard-Techno', 'Hardcore', 'Gabber'],
    170: ['DnB', 'Jungle', 'Neurofunk'],
    180: ['Hardcore', 'Speedcore', 'Breakcore']
};

const KEYWORD_MODIFIERS = {
    dark: ['Industrial', 'Sinister', 'Haunting', 'Raw', 'Underground', 'Gritty'],
    industrial: ['Mechanical', 'Raw', 'Metallic', 'Harsh', 'Factory', 'Steel'],
    bass: ['Sub', 'Deep', 'Heavy', 'Rumbling', '808', 'Wobble'],
    acid: ['303', 'Squelchy', 'Resonant', 'Filtered', 'Acidic', 'TB'],
    melodic: ['Ethereal', 'Emotional', 'Progressive', 'Uplifting', 'Beautiful'],
    ambient: ['Atmospheric', 'Floating', 'Dreamy', 'Spacious', 'Zen'],
    vintage: ['Retro', 'Classic', 'Analog', 'Warm', 'Nostalgic'],
    modern: ['Digital', 'Clean', 'Processed', 'Contemporary', 'Futuristic'],
    hard: ['Aggressive', 'Brutal', 'Intense', 'Powerful', 'Driving'],
    soft: ['Gentle', 'Smooth', 'Mellow', 'Subtle', 'Delicate'],
    glitch: ['Broken', 'Stuttered', 'Chopped', 'Fragmented', 'Digital'],
    organic: ['Natural', 'Live', 'Human', 'Acoustic', 'Real']
};

// Application state
let generatedNames = [];

// Utility functions
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
}

function parseKeywords(text) {
    if (!text) return [];
    return text.toLowerCase()
        .split(/[\s,#]+/)
        .filter(k => k.length > 0);
}

function getGenreFromBPM(bpm) {
    const numBpm = parseInt(bpm);
    let closestBPM = 120;
    let minDiff = Math.abs(numBpm - 120);

    Object.keys(BPM_GENRES).forEach(targetBPM => {
        const diff = Math.abs(numBpm - parseInt(targetBPM));
        if (diff < minDiff) {
            minDiff = diff;
            closestBPM = parseInt(targetBPM);
        }
    });

    const genres = BPM_GENRES[closestBPM] || ['Electronic'];
    return getRandomElement(genres);
}

function getKeywordModifiers(keywords) {
    const modifiers = [];
    keywords.forEach(keyword => {
        const mods = KEYWORD_MODIFIERS[keyword];
        if (mods) {
            modifiers.push(...mods);
        }
    });
    return [...new Set(modifiers)]; // Remove duplicates
}

function getFormData() {
    return {
        sampleType: document.getElementById('sampleType').value,
        genre: document.getElementById('genre').value,
        bpm: document.getElementById('bpm').value,
        key: document.getElementById('key').value,
        keywords: document.getElementById('keywords').value,
        scale: document.querySelector('input[name="scale"]:checked').value
    };
}

function getAdjectives(data) {
    let adjectives = [...(ADJECTIVES[data.sampleType] || [])];

    // Add keyword-based adjectives
    if (data.keywords) {
        const keywords = parseKeywords(data.keywords);
        const keywordMods = getKeywordModifiers(keywords);
        adjectives.push(...keywordMods);
    }

    return [...new Set(adjectives)]; // Remove duplicates
}

function getGenre(data) {
    // If genre is manually selected, use it
    if (data.genre) {
        return data.genre;
    }

    // Auto-detect from BPM
    if (data.bpm) {
        return getGenreFromBPM(parseInt(data.bpm));
    }

    return null;
}

function createSampleName(data) {
    let nameParts = [data.sampleType];

    // Add adjectives
    const adjectives = getAdjectives(data);
    if (adjectives.length > 0) {
        const selectedAdjectives = getRandomElements(adjectives, 2);
        nameParts.push(...selectedAdjectives);
    }

    // Add genre
    const finalGenre = getGenre(data);
    if (finalGenre) {
        nameParts.push(finalGenre);
    }

    // Add BPM
    if (data.bpm) {
        nameParts.push(`${data.bpm}BPM`);
    }

    // Add key and scale
    if (data.key && data.scale !== 'none') {
        nameParts.push(`${data.key}_${data.scale}`);
    }

    return nameParts.join('_');
}

function generateName() {
    console.log('Generate function called');
    
    const formData = getFormData();
    console.log('Form data:', formData);
    
    if (!formData.sampleType) {
        alert('Please select a sample type!');
        return;
    }

    const name = createSampleName(formData);
    console.log('Generated name:', name);
    
    const enableNumbering = document.getElementById('enableNumbering').checked;

    if (enableNumbering) {
        generatedNames.push(name);
    } else {
        generatedNames = [name];
    }

    updateResults();
}

function updateResults() {
    const resultsList = document.getElementById('resultsList');
    const resultsCount = document.getElementById('resultsCount');
    
    resultsCount.textContent = generatedNames.length;

    if (generatedNames.length === 0) {
        resultsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎼</div>
                <p>No samples generated yet. Fill the form above and click generate!</p>
            </div>
        `;
        return;
    }

    const enableNumbering = document.getElementById('enableNumbering').checked;
    const html = generatedNames
        .map((name, index) => {
            const displayName = enableNumbering 
                ? `${name}_${(index + 1).toString().padStart(2, '0')}`
                : name;
            return `
                <div class="result-item" onclick="copyToClipboard('${displayName}', this)">
                    ${displayName}
                    <span class="copy-indicator">Copied!</span>
                </div>
            `;
        })
        .join('');
    
    resultsList.innerHTML = html;
}

async function copyToClipboard(text, element) {
    try {
        await navigator.clipboard.writeText(text);
        showCopyFeedback(element);
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyFeedback(element);
    }
}

function showCopyFeedback(element) {
    const indicator = element.querySelector('.copy-indicator');
    indicator.classList.add('show');
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 1000);
}

function clearResults() {
    generatedNames = [];
    updateResults();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    
    // Generate button handler
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            console.log('Generate button clicked');
            generateName();
        });
    }

    // Clear button handler
    const clearBtn = document.getElementById('clearResults');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            console.log('Clear button clicked');
            clearResults();
        });
    }

    // Initialize results
    updateResults();
});