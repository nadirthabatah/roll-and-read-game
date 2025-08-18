# 🎲 Roll & Read Game

A therapeutic reading practice game designed for students with dyslexia. Built with Next.js, featuring dice-based word selection and speech recognition for reading assessment.

![Roll & Read Game Interface](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-blueviolet)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)

## ✨ Features

### 🎮 Core Gameplay
- **3D Dice Rolling**: High-contrast dice with clear black dots on white background
- **Word Practice**: 6 rows of phonetically organized words per level
- **Speech Recognition**: 60-second recording window with real-time feedback
- **Progress Tracking**: Visual completion indicators and accuracy scoring

### 🎨 Accessibility Design
- **High Contrast**: Optimized for dyslexia and visual processing differences
- **Dark/Light Mode**: Toggle for lighting preferences
- **Large Text**: Clear, readable fonts and sizing
- **No Distractions**: Minimal UI that keeps focus on reading

### 🔊 Audio Features
- **Custom Dice Sounds**: Realistic rolling sound effects
- **Voice Wave Animation**: Visual feedback during recording
- **Smart Audio Control**: Sounds stop appropriately to avoid overwhelming users

### 📱 User Experience
- **No Blocking Popups**: Students can see words while recording (critical for reading practice)
- **One-Click Recording**: Simple "Read these words" button
- **Manual Stop Control**: Click the voice wave to stop recording early
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Deepgram API key (for speech recognition)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/roll-and-read.git
cd roll-and-read

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the game in action!

## 🎯 How to Play

1. **Setup**: Click "Select Learning Level" to choose difficulty and word category
2. **Roll**: Click the dice to get a number (1-6)
3. **Read**: The corresponding row lights up - read all the words aloud
4. **Record**: Click "Read these words" and speak clearly
5. **Complete**: Click the voice wave to stop, or wait 60 seconds for auto-stop
6. **Progress**: Watch your accuracy improve as you complete more rows!

## 🎓 Educational Background

This game implements principles from the **Orton-Gillingham methodology**, a structured, sequential approach to teaching reading that's particularly effective for students with dyslexia.

### Learning Features
- **Phonetic Organization**: Words grouped by sound patterns
- **Progressive Difficulty**: 5 levels from foundation to advanced
- **Multisensory Approach**: Visual, auditory, and kinesthetic learning
- **Immediate Feedback**: Real-time accuracy assessment

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Check code quality
```

## 🤝 Contributing

We welcome contributions! This project is designed to help students with dyslexia, so all improvements that enhance accessibility and learning effectiveness are appreciated.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Orton-Gillingham Institute** - For the foundational reading methodology
- **Dyslexia Therapy Community** - For feedback and testing
- **Open Source Contributors** - For the amazing tools that make this possible

---

**Built with ❤️ for students with dyslexia and the therapists who support them.**
