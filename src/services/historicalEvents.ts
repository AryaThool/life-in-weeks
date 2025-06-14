// Historical Events Service
// Provides various sources of historical events to populate the timeline

export interface HistoricalEvent {
  id: string
  title: string
  description: string
  date: string
  category: 'world' | 'technology' | 'culture' | 'science' | 'sports' | 'disaster' | 'politics'
  significance: 'low' | 'medium' | 'high' | 'critical'
  source: string
  tags: string[]
}

// Curated historical events dataset
const HISTORICAL_EVENTS: HistoricalEvent[] = [
  // Technology Milestones
  {
    id: 'internet-1991',
    title: 'World Wide Web Goes Public',
    description: 'Tim Berners-Lee releases the first web browser and makes the World Wide Web available to the public.',
    date: '1991-08-06',
    category: 'technology',
    significance: 'critical',
    source: 'Historical Records',
    tags: ['internet', 'technology', 'communication']
  },
  {
    id: 'google-1998',
    title: 'Google Founded',
    description: 'Larry Page and Sergey Brin found Google, revolutionizing internet search.',
    date: '1998-09-04',
    category: 'technology',
    significance: 'high',
    source: 'Historical Records',
    tags: ['google', 'search', 'internet']
  },
  {
    id: 'facebook-2004',
    title: 'Facebook Launched',
    description: 'Mark Zuckerberg launches Facebook from Harvard, beginning the social media revolution.',
    date: '2004-02-04',
    category: 'technology',
    significance: 'high',
    source: 'Historical Records',
    tags: ['social media', 'facebook', 'communication']
  },
  {
    id: 'iphone-2007',
    title: 'iPhone Released',
    description: 'Apple releases the first iPhone, revolutionizing mobile technology and smartphones.',
    date: '2007-06-29',
    category: 'technology',
    significance: 'critical',
    source: 'Historical Records',
    tags: ['apple', 'smartphone', 'mobile']
  },
  {
    id: 'youtube-2005',
    title: 'YouTube Founded',
    description: 'Chad Hurley, Steve Chen, and Jawed Karim create YouTube, transforming video sharing.',
    date: '2005-02-14',
    category: 'technology',
    significance: 'high',
    source: 'Historical Records',
    tags: ['youtube', 'video', 'social media']
  },
  {
    id: 'twitter-2006',
    title: 'Twitter Launched',
    description: 'Jack Dorsey launches Twitter, creating the microblogging revolution.',
    date: '2006-03-21',
    category: 'technology',
    significance: 'high',
    source: 'Historical Records',
    tags: ['twitter', 'social media', 'microblogging']
  },
  {
    id: 'netflix-streaming-2007',
    title: 'Netflix Begins Streaming',
    description: 'Netflix launches its streaming service, changing how we consume entertainment.',
    date: '2007-01-16',
    category: 'technology',
    significance: 'high',
    source: 'Historical Records',
    tags: ['netflix', 'streaming', 'entertainment']
  },
  {
    id: 'spotify-2008',
    title: 'Spotify Launches',
    description: 'Spotify revolutionizes music streaming and changes the music industry.',
    date: '2008-10-07',
    category: 'technology',
    significance: 'medium',
    source: 'Historical Records',
    tags: ['spotify', 'music', 'streaming']
  },
  {
    id: 'instagram-2010',
    title: 'Instagram Launched',
    description: 'Kevin Systrom and Mike Krieger launch Instagram, transforming photo sharing.',
    date: '2010-10-06',
    category: 'technology',
    significance: 'medium',
    source: 'Historical Records',
    tags: ['instagram', 'photos', 'social media']
  },
  {
    id: 'chatgpt-2022',
    title: 'ChatGPT Released',
    description: 'OpenAI releases ChatGPT, bringing AI to mainstream users and starting the AI revolution.',
    date: '2022-11-30',
    category: 'technology',
    significance: 'critical',
    source: 'Historical Records',
    tags: ['ai', 'chatgpt', 'artificial intelligence']
  },

  // World Events
  {
    id: '9-11-2001',
    title: 'September 11 Attacks',
    description: 'Terrorist attacks on the World Trade Center and Pentagon change global security forever.',
    date: '2001-09-11',
    category: 'world',
    significance: 'critical',
    source: 'Historical Records',
    tags: ['terrorism', 'security', 'america']
  },
  {
    id: 'covid-pandemic-2020',
    title: 'COVID-19 Pandemic Declared',
    description: 'WHO declares COVID-19 a global pandemic, leading to worldwide lockdowns.',
    date: '2020-03-11',
    category: 'world',
    significance: 'critical',
    source: 'Historical Records',
    tags: ['pandemic', 'health', 'global']
  },
  {
    id: 'berlin-wall-1989',
    title: 'Fall of Berlin Wall',
    description: 'The Berlin Wall falls, symbolizing the end of the Cold War era.',
    date: '1989-11-09',
    category: 'politics',
    significance: 'critical',
    source: 'Historical Records',
    tags: ['cold war', 'germany', 'freedom']
  },
  {
    id: 'obama-president-2009',
    title: 'Barack Obama Becomes President',
    description: 'Barack Obama is inaugurated as the first African American President of the United States.',
    date: '2009-01-20',
    category: 'politics',
    significance: 'high',
    source: 'Historical Records',
    tags: ['president', 'america', 'history']
  },

  // Cultural Milestones
  {
    id: 'harry-potter-1997',
    title: 'Harry Potter Published',
    description: 'J.K. Rowling publishes the first Harry Potter book, creating a global phenomenon.',
    date: '1997-06-26',
    category: 'culture',
    significance: 'high',
    source: 'Historical Records',
    tags: ['books', 'literature', 'fantasy']
  },
  {
    id: 'titanic-movie-1997',
    title: 'Titanic Movie Released',
    description: 'James Cameron\'s Titanic becomes the highest-grossing film of all time.',
    date: '1997-12-19',
    category: 'culture',
    significance: 'medium',
    source: 'Historical Records',
    tags: ['movies', 'cinema', 'romance']
  },
  {
    id: 'avatar-movie-2009',
    title: 'Avatar Movie Released',
    description: 'James Cameron\'s Avatar revolutionizes 3D cinema and becomes highest-grossing film.',
    date: '2009-12-18',
    category: 'culture',
    significance: 'medium',
    source: 'Historical Records',
    tags: ['movies', '3d', 'technology']
  },

  // Science & Space
  {
    id: 'human-genome-2003',
    title: 'Human Genome Project Completed',
    description: 'Scientists complete the mapping of the human genome, revolutionizing medicine.',
    date: '2003-04-14',
    category: 'science',
    significance: 'critical',
    source: 'Historical Records',
    tags: ['genetics', 'medicine', 'science']
  },
  {
    id: 'spacex-falcon-heavy-2018',
    title: 'SpaceX Falcon Heavy Launch',
    description: 'SpaceX successfully launches Falcon Heavy, advancing commercial space travel.',
    date: '2018-02-06',
    category: 'science',
    significance: 'high',
    source: 'Historical Records',
    tags: ['space', 'spacex', 'technology']
  },
  {
    id: 'mars-rover-2021',
    title: 'Perseverance Rover Lands on Mars',
    description: 'NASA\'s Perseverance rover successfully lands on Mars to search for signs of life.',
    date: '2021-02-18',
    category: 'science',
    significance: 'high',
    source: 'Historical Records',
    tags: ['mars', 'nasa', 'space exploration']
  },

  // Sports
  {
    id: 'olympics-2008-beijing',
    title: 'Beijing Olympics',
    description: 'China hosts the Summer Olympics, showcasing spectacular opening ceremony.',
    date: '2008-08-08',
    category: 'sports',
    significance: 'medium',
    source: 'Historical Records',
    tags: ['olympics', 'china', 'sports']
  },
  {
    id: 'world-cup-2018-russia',
    title: 'FIFA World Cup Russia',
    description: 'France wins the FIFA World Cup in Russia, with memorable matches throughout.',
    date: '2018-06-14',
    category: 'sports',
    significance: 'medium',
    source: 'Historical Records',
    tags: ['world cup', 'football', 'russia']
  },

  // Disasters
  {
    id: 'tsunami-2004',
    title: 'Indian Ocean Tsunami',
    description: 'Devastating tsunami affects 14 countries, killing over 230,000 people.',
    date: '2004-12-26',
    category: 'disaster',
    significance: 'critical',
    source: 'Historical Records',
    tags: ['tsunami', 'disaster', 'natural disaster']
  },
  {
    id: 'fukushima-2011',
    title: 'Fukushima Nuclear Disaster',
    description: 'Earthquake and tsunami cause nuclear disaster at Fukushima power plant.',
    date: '2011-03-11',
    category: 'disaster',
    significance: 'high',
    source: 'Historical Records',
    tags: ['nuclear', 'disaster', 'japan']
  }
]

// Life stage milestones that can be automatically calculated
export interface LifeStageMilestone {
  ageInYears: number
  title: string
  description: string
  category: 'personal'
  significance: 'medium'
}

const LIFE_STAGE_MILESTONES: LifeStageMilestone[] = [
  {
    ageInYears: 5,
    title: 'Started School Age',
    description: 'Typical age when children start formal education',
    category: 'personal',
    significance: 'medium'
  },
  {
    ageInYears: 13,
    title: 'Became a Teenager',
    description: 'Entered teenage years - a time of growth and discovery',
    category: 'personal',
    significance: 'medium'
  },
  {
    ageInYears: 16,
    title: 'Driving Age',
    description: 'Reached typical driving age in many countries',
    category: 'personal',
    significance: 'medium'
  },
  {
    ageInYears: 18,
    title: 'Became an Adult',
    description: 'Reached legal adulthood in most countries',
    category: 'personal',
    significance: 'medium'
  },
  {
    ageInYears: 21,
    title: 'Legal Drinking Age',
    description: 'Reached legal drinking age in many countries',
    category: 'personal',
    significance: 'medium'
  },
  {
    ageInYears: 25,
    title: 'Quarter Century',
    description: 'Completed 25 years of life - often a time of career establishment',
    category: 'personal',
    significance: 'medium'
  },
  {
    ageInYears: 30,
    title: 'Entered 30s',
    description: 'Beginning of the fourth decade - often focused on career and relationships',
    category: 'personal',
    significance: 'medium'
  },
  {
    ageInYears: 40,
    title: 'Entered 40s',
    description: 'Beginning of the fifth decade - often a time of reflection and achievement',
    category: 'personal',
    significance: 'medium'
  },
  {
    ageInYears: 50,
    title: 'Half Century',
    description: 'Completed 50 years of life - a significant milestone',
    category: 'personal',
    significance: 'medium'
  }
]

export class HistoricalEventsService {
  // Get historical events that occurred during a person's lifetime
  static getHistoricalEventsForLifetime(birthdate: string, significance: ('low' | 'medium' | 'high' | 'critical')[] = ['medium', 'high', 'critical']): HistoricalEvent[] {
    const birthDate = new Date(birthdate)
    const today = new Date()
    
    return HISTORICAL_EVENTS.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= birthDate && 
             eventDate <= today && 
             significance.includes(event.significance)
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Get life stage milestones for a person
  static getLifeStageMilestones(birthdate: string): HistoricalEvent[] {
    const birthDate = new Date(birthdate)
    const today = new Date()
    const currentAge = today.getFullYear() - birthDate.getFullYear()
    
    return LIFE_STAGE_MILESTONES
      .filter(milestone => milestone.ageInYears <= currentAge)
      .map(milestone => {
        const milestoneDate = new Date(birthDate)
        milestoneDate.setFullYear(birthDate.getFullYear() + milestone.ageInYears)
        
        return {
          id: `life-stage-${milestone.ageInYears}`,
          title: milestone.title,
          description: milestone.description,
          date: milestoneDate.toISOString().split('T')[0],
          category: milestone.category as any,
          significance: milestone.significance as any,
          source: 'Life Stages',
          tags: ['personal', 'milestone', 'age']
        }
      })
  }

  // Get technology adoption timeline
  static getTechnologyTimeline(birthdate: string): HistoricalEvent[] {
    return this.getHistoricalEventsForLifetime(birthdate)
      .filter(event => event.category === 'technology')
  }

  // Get world events timeline
  static getWorldEventsTimeline(birthdate: string): HistoricalEvent[] {
    return this.getHistoricalEventsForLifetime(birthdate)
      .filter(event => event.category === 'world' || event.category === 'politics')
  }

  // Get cultural timeline
  static getCulturalTimeline(birthdate: string): HistoricalEvent[] {
    return this.getHistoricalEventsForLifetime(birthdate)
      .filter(event => event.category === 'culture')
  }

  // Get all available historical events for a person
  static getAllHistoricalEvents(birthdate: string, includeLifeStages: boolean = true): HistoricalEvent[] {
    const historicalEvents = this.getHistoricalEventsForLifetime(birthdate)
    const lifeStageEvents = includeLifeStages ? this.getLifeStageMilestones(birthdate) : []
    
    return [...historicalEvents, ...lifeStageEvents]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Get events by category
  static getEventsByCategory(birthdate: string, categories: string[]): HistoricalEvent[] {
    return this.getHistoricalEventsForLifetime(birthdate)
      .filter(event => categories.includes(event.category))
  }

  // Get events by significance level
  static getEventsBySignificance(birthdate: string, significance: ('low' | 'medium' | 'high' | 'critical')[]): HistoricalEvent[] {
    return this.getHistoricalEventsForLifetime(birthdate, significance)
  }
}