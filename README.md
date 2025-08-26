# 🎵 Lorri - AI Music Generation + Solana NFTs

<div align="center">

![Lorri Logo](https://img.shields.io/badge/Lorri-AI%20Music%20Generator-purple?style=for-the-badge&logo=music)
![Solana](https://img.shields.io/badge/Solana-NFT%20Platform-green?style=for-the-badge&logo=solana)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)

**Transform your ideas into unique music tracks using cutting-edge AI, then buy, sell, and trade them on the Solana blockchain.**

[🚀 Live Demo](#) • [📖 Documentation](#) • [💬 Discord](#) • [🐛 Report Bug](#)

</div>

---

## ✨ What is Lorri?

**Lorri** is a revolutionary decentralized platform that combines the power of artificial intelligence with blockchain technology to democratize music creation and commerce. Users can generate unique, professional-quality music tracks from simple text descriptions, mint them as NFTs, and participate in a vibrant marketplace for buying and selling digital music assets.

### 🌟 Key Features

- **🎼 AI-Powered Music Generation** - Create music from text descriptions
- **💎 Solana NFT Minting** - Transform music into tradeable NFTs
- **💰 Web3 Marketplace** - Buy and sell music with SOL payments
- **🔗 Wallet Integration** - Seamless Solana wallet connectivity
- **💸 Royalty System** - Earn passive income from NFT sales
- **⚡ Lightning Fast** - Get results in seconds, not hours
- **🔒 Secure & Transparent** - Built on Solana blockchain
- **🌍 Global Community** - Connect with music creators worldwide

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Solana wallet (Phantom, Solflare, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lorri.git
   cd lorri
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/lorri"
   
   # Authentication
   BETTER_AUTH_SECRET="your-secret-key"
   
   # AWS S3 (for audio storage)
   AWS_ACCESS_KEY_ID="your-aws-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret"
   AWS_REGION="us-east-1"
   S3_BUCKET_NAME="your-bucket-name"
   
   # Modal AI (for music generation)
   MODAL_KEY="your-modal-key"
   MODAL_SECRET="your-modal-secret"
   GENERATE_FROM_DESCRIPTION="https://your-modal-endpoint"
   GENERATE_FROM_DESCRIBED_LYRICS="https://your-modal-endpoint"
   GENERATE_WITH_LYRICS="https://your-modal-endpoint"
   
   # Solana Configuration
   SOLANA_RPC_URL="https://api.devnet.solana.com"
   SOLANA_NETWORK="devnet"
   NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
   NEXT_PUBLIC_SOLANA_NETWORK="devnet"
   ```

4. **Set up the database**
   ```bash
   # Start PostgreSQL (if using Docker)
   ./start-database.sh
   
   # Run database migrations
   npm run db:push
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎯 How It Works

### 1. **Describe Your Music** 🎵
Simply describe the music you want to create:
- "A dreamy lofi hip hop song, perfect for studying or relaxing"
- "Epic movie score with orchestral elements and driving percussion"
- "80s synth-pop with catchy melodies and retro vibes"

### 2. **AI Generates** 🤖
Our advanced AI creates unique, high-quality music based on your description:
- Professional-grade audio quality
- Multiple generation parameters (guidance scale, duration, etc.)
- Support for instrumental and vocal tracks
- Results in seconds, not hours

### 3. **Mint as NFT** 💎
Transform your music into a unique NFT on Solana:
- Rich metadata with song details and artwork
- Automatic royalty distribution (5% default)
- Verifiable ownership on blockchain
- Tradeable on NFT marketplaces

### 4. **Buy & Sell** 💰
Participate in the decentralized music marketplace:
- Set your own prices in SOL
- Connect your Solana wallet
- Buy music from other creators
- Earn royalties from sales

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **Lucide React** - Icon library

### **Backend**
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Better Auth** - Authentication system
- **Inngest** - Background job processing

### **Blockchain**
- **Solana** - High-performance blockchain
- **Wallet Adapter** - Multi-wallet support (Phantom, Solflare)
- **Web3.js** - Solana blockchain interaction
- **NFT Standards** - Metaplex compatibility

### **AI & Storage**
- **Modal AI** - Music generation endpoints
- **AWS S3** - Audio file storage
- **Presigned URLs** - Secure file access

---

## 🎨 Features

### **Music Creation**
- **Simple Mode** - Text-to-music generation
- **Custom Mode** - Lyrics + style prompts
- **Instrumental Toggle** - Generate with/without vocals
- **Multiple Parameters** - Guidance scale, duration, seed

### **Web3 Marketplace**
- **Wallet Connection** - Seamless Solana wallet integration
- **Buy Music** - Purchase tracks with SOL payments
- **Sell Music** - List your tracks for sale
- **Royalty System** - Automated royalty distribution
- **Transaction History** - Track all purchases and sales

### **NFT Functionality**
- **Metadata Standards** - Compatible with major marketplaces
- **Collection Management** - Organize NFTs into custom collections
- **Royalty System** - Configurable royalty percentages
- **Ownership Verification** - Clear blockchain proof

### **User Experience**
- **Real-time Generation** - Watch your music being created
- **Search & Filter** - Find tracks by title, prompt, or collection
- **Social Features** - Like, share, and discover music
- **Mobile Responsive** - Works on all devices

---

## 💰 Web3 Payment System

### **Getting Started with Web3**
1. **Install a Solana Wallet**
   - [Phantom](https://phantom.app/) (Recommended)
   - [Solflare](https://solflare.com/)
   - [Backpack](https://backpack.app/)

2. **Get SOL Tokens**
   - **Devnet**: Use Solana faucet for testing
   - **Mainnet**: Purchase from exchanges like Coinbase, Binance

3. **Connect Your Wallet**
   - Click "Connect Wallet" in the top navigation
   - Approve the connection request
   - Your wallet address will be displayed

### **Buying Music**
1. Browse the marketplace for available tracks
2. Click "Buy" on any track you want to purchase
3. Review the transaction details
4. Approve the transaction in your wallet
5. Wait for blockchain confirmation
6. The track is now yours!

### **Selling Music**
1. Create and publish your music
2. Click "Put for Sale" on your track
3. Set your price in SOL
4. Connect your wallet to receive payments
5. Your track is now listed in the marketplace

### **Transaction Fees**
- **Platform Fee**: 5% of sale price
- **Network Fee**: ~0.000005 SOL per transaction
- **Creator Receives**: 95% of sale price

---

## 📱 Screenshots

<div align="center">

![Landing Page](https://via.placeholder.com/800x400/6366f1/ffffff?text=Stunning+Landing+Page)
![Music Creation](https://via.placeholder.com/800x400/ec4899/ffffff?text=AI+Music+Generation)
![NFT Marketplace](https://via.placeholder.com/800x400/10b981/ffffff?text=Solana+NFT+Marketplace)
![Web3 Payments](https://via.placeholder.com/800x400/f59e0b/ffffff?text=Web3+Payment+System)

</div>

---

## 🔧 Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run typecheck    # TypeScript type checking
npm run format:check # Check Prettier formatting
npm run format:write # Format code with Prettier
```

### **Project Structure**

```
lorri/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (main)/            # Protected main app routes
│   │   │   ├── marketplace/   # Web3 marketplace
│   │   │   └── create/        # Music creation
│   │   └── api/               # API endpoints
│   │       ├── purchases/     # Purchase API
│   │       └── songs/         # Song management API
│   ├── components/             # React components
│   │   ├── create/            # Music creation components
│   │   ├── home/              # Dashboard components
│   │   ├── payment/           # Web3 payment components
│   │   ├── sidebar/           # Navigation components
│   │   └── ui/                # Reusable UI components
│   ├── actions/                # Server actions
│   ├── lib/                    # Utility functions
│   │   ├── solana.ts          # Solana blockchain utilities
│   │   └── auth.ts            # Authentication utilities
│   ├── stores/                 # State management
│   └── styles/                 # Global styles
├── prisma/                     # Database schema
├── public/                     # Static assets
└── docs/                       # Documentation
```

---

## 🌐 Deployment

### **Vercel (Recommended)**

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

### **Docker**

```bash
# Build the image
docker build -t lorri .

# Run the container
docker run -p 3000:3000 lorri
```

### **Environment Variables**

Make sure to set all required environment variables in your production environment:

```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
BETTER_AUTH_SECRET="your-production-secret"
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
SOLANA_NETWORK="mainnet-beta"
```

---

## 🔒 Security & Privacy

### **Web3 Security**
- **Wallet Security**: Users control their private keys
- **Transaction Verification**: All transactions require user approval
- **Smart Contract Audits**: Regular security audits
- **Multi-Signature Support**: Enhanced security options

### **Data Protection**
- **GDPR Compliance**: User privacy protection
- **Encrypted Storage**: Secure data storage
- **Access Control**: Role-based access management
- **Audit Logs**: Comprehensive activity logging

---

## 📚 Documentation

- **[Solana Web3 Policy](./SOLANA_WEB3_POLICY.md)** - Comprehensive Web3 policy
- **[API Documentation](./docs/api.md)** - API reference
- **[Deployment Guide](./docs/deployment.md)** - Deployment instructions
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute

---

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🆘 Support

- **Documentation**: [docs.lorri.com](https://docs.lorri.com)
- **Discord**: [Join our community](https://discord.gg/lorri)
- **Email**: support@lorri.com
- **Twitter**: [@LorriMusic](https://twitter.com/LorriMusic)

---

## 🙏 Acknowledgments

- **Solana Foundation** - For the amazing blockchain platform
- **Modal AI** - For powerful music generation capabilities
- **Next.js Team** - For the excellent React framework
- **Open Source Community** - For all the amazing tools and libraries

---

<div align="center">

**Made with ❤️ by the Lorri Team**

[Website](https://lorri.com) • [Twitter](https://twitter.com/LorriMusic) • [Discord](https://discord.gg/lorri) • [GitHub](https://github.com/yourusername/lorri)

</div>
