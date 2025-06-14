# Life in Weeks Timeline

A beautiful, interactive web application that helps you visualize your entire life story week by week. Transform your personal milestones into a stunning visual timeline, preserve precious memories with file attachments, and gain insights into your life's journey.

![Life in Weeks Timeline](https://roaring-liger-0c760b.netlify.app)

## 🌟 Project Overview

Life in Weeks Timeline is inspired by the concept that an average human life spans approximately 4,160 weeks. This application helps you:

- **Visualize Your Life**: See your entire life mapped out in an interactive grid where each square represents one week
- **Document Milestones**: Record important events, achievements, and memories with rich descriptions
- **Preserve Memories**: Upload photos, documents, videos, and other files to preserve your precious moments
- **Gain Insights**: Analyze patterns in your life with built-in analytics and statistics
- **Historical Context**: Automatically add world events and cultural milestones that happened during your lifetime
- **Export & Share**: Generate beautiful PDF reports, images, and data exports of your life story

This project matters because it helps people reflect on their life's journey, appreciate their experiences, and plan for the future with a unique perspective on time and personal growth.

## ✨ Key Features

### 📅 Interactive Timeline Visualization
- **Multi-level Views**: Switch between week, month, quarter, and year views
- **Color-coded Events**: Visual indicators showing event density and categories
- **Current Week Highlighting**: Always know where you are in your life timeline
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices

### 📎 Rich Memory Preservation
- **File Attachments**: Upload images, documents, videos, audio files, and archives (up to 50MB per file)
- **File Preview**: Built-in preview for images, videos, audio, and PDF files
- **Secure Storage**: All files are securely stored with user-specific access controls
- **Download & Share**: Easy file management with download and sharing capabilities

### 🌍 Historical Context Integration
- **World Events**: Automatically add significant historical events that occurred during your lifetime
- **Technology Milestones**: Track major technological advances you've witnessed
- **Cultural Moments**: Include important cultural and social milestones
- **Life Stage Markers**: Automatic milestones for birthdays, coming of age, and life transitions

### 📊 Analytics & Insights
- **Life Statistics**: Track weeks lived, events recorded, and life progress
- **Category Analysis**: See which areas of life you document most
- **Year-by-Year Breakdown**: Understand your most active periods
- **Personal Insights**: Discover patterns and trends in your life story

### 📄 Comprehensive Export Options
- **PNG Images**: High-quality timeline visualizations
- **Basic PDF**: Simple PDF with timeline image and basic information
- **Comprehensive PDF Report**: Detailed life analysis with statistics, insights, and complete event listings
- **JSON Data**: Complete data export for backup or analysis
- **CSV Spreadsheet**: Event data in spreadsheet format for further analysis

### 🔐 Security & Privacy
- **User Authentication**: Secure sign-up and sign-in with email/password
- **Row-Level Security**: Your data is completely private and secure
- **File Encryption**: All uploaded files are encrypted and access-controlled
- **Data Ownership**: You own all your data and can export it anytime

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development for better code quality
- **Tailwind CSS** - Utility-first CSS framework for beautiful, responsive design
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful, customizable icons

### Backend & Database
- **Supabase** - Backend-as-a-Service providing:
  - PostgreSQL database with real-time subscriptions
  - Authentication and user management
  - File storage with CDN
  - Row-level security (RLS)
  - RESTful APIs

### Key Libraries
- **React Hook Form** - Efficient form handling with validation
- **React Hot Toast** - Beautiful toast notifications
- **React Dropzone** - Drag-and-drop file uploads
- **date-fns** - Modern date utility library
- **html2canvas** - HTML to canvas conversion for exports
- **jsPDF** - PDF generation for reports

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing with Autoprefixer
- **TypeScript ESLint** - TypeScript-specific linting rules

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Supabase account** (free tier available)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd life-weeks-timeline
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new account or sign in
   - Create a new project

2. **Get Your Supabase Credentials**:
   - Go to Project Settings → API
   - Copy your Project URL and anon public key

3. **Update Supabase Configuration**:
   - Open `src/lib/supabase.ts`
   - Replace the `supabaseUrl` and `supabaseAnonKey` with your credentials:
   ```typescript
   const supabaseUrl = 'YOUR_SUPABASE_URL'
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
   ```

4. **Run Database Migrations**:
   - In your Supabase dashboard, go to SQL Editor
   - Run each migration file in order from the `supabase/migrations/` folder
   - Or use the Supabase CLI if you have it installed

5. **Set Up Storage**:
   - The migrations will automatically create the storage bucket
   - Ensure the storage policies are properly configured

### 4. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🌐 Deployment

This project is optimized for deployment on:
- **Netlify** (recommended) - Automatic deployments from Git
- **Vercel** - Seamless React deployment
- **Any static hosting service** - The build output is static files

### Environment Variables
Make sure to set up the following environment variables in your deployment platform:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon public key

## 📱 Usage

1. **Sign Up**: Create an account with your email and birthdate
2. **Add Events**: Click on any week to add events and milestones
3. **Upload Files**: Attach photos, documents, and other files to your events
4. **Explore Views**: Switch between different timeline views (week, month, quarter, year)
5. **Add Historical Events**: Use the historical events feature to add world events
6. **Export Your Timeline**: Generate beautiful reports and exports of your life story

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by the "Life in Weeks" concept popularized by Tim Urban of Wait But Why
- Built with modern web technologies and best practices
- Designed with user privacy and data ownership in mind

---

**Live Demo**: [https://roaring-liger-0c760b.netlify.app](https://roaring-liger-0c760b.netlify.app)

Made with ❤️ for life storytellers everywhere.