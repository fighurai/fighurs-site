export type Issue = {
  slug: string
  number: string
  title: string
  subtitle: string
  subject: string
  year: string
  month?: string
  price: string
  cover: string
  collage?: string[]
  pdf: string
  blurb: string
  accent: string
}

export const issues: Issue[] = [
  {
    slug: 'juhm',
    number: '007',
    title: 'THE MINUSCULE IS IN',
    subtitle: 'JUHM • Creator Feature',
    subject: 'Juhm',
    year: '2026',
    price: '$25',
    cover: '/covers/cover-juhm-new.jpg',
    collage: ['/covers/collage-1.jpg', '/covers/juhm-3.jpg'],
    pdf: '/issues/juhm.pdf',
    accent: '#F2FF3A',
    blurb:
      'Juhm is a social media creator redefining how personality translates online — where humor, fashion, and cultural commentary collapse into something distinctly his own. THE MINUSCULE IS IN explores how nuance becomes influence.',
  },
  {
    slug: 'iconikki',
    number: '006',
    title: 'THE ICON',
    subtitle: 'ICONIKKI • Creator Feature',
    subject: 'ICONIKKI',
    year: '2026',
    price: '$25',
    cover: '/covers/cover-iconikki-clear.jpg',
    collage: ['/covers/collage-3.jpg', '/covers/iconikki-2.jpg'],
    pdf: '/issues/iconikki.pdf',
    accent: '#FF4D9A',
    blurb:
      'ICONIKKI is a fashion-forward creator and stylist whose TikTok presence feels like a live moodboard — quick-fit moments, bold styling choices, and the confidence that makes everyday looks feel editorial.',
  },
  {
    slug: 'masue-kamara',
    number: '005',
    title: 'THE ARTIST',
    subtitle: 'Masue Kamara • Artist Feature',
    subject: 'Masue Kamara',
    year: '2025',
    price: '$25',
    cover: '/covers/cover-masue-kamara-clear.jpg',
    collage: ['/covers/collage-4.jpg', '/covers/masue-kamara-2.jpg'],
    pdf: '/issues/masue-kamara.pdf',
    accent: '#E8C547',
    blurb:
      'Masue Kamara is a multidisciplinary artist whose work explores identity, restraint, and emotional presence. A study in self-definition, vision, and creating on one’s own terms.',
  },
  {
    slug: 'nyfw-ss26',
    number: '004',
    title: 'NYFW SS26',
    subtitle: 'Behind the Runway • Special Edition',
    subject: 'New York Fashion Week',
    year: '2025',
    price: '$25',
    cover: '/covers/cover-nyfw-ss26-clear.jpg',
    collage: ['/covers/nyfw-late0.jpg', '/covers/nyfw-late4.jpg'],
    pdf: '/issues/nyfw-ss26.pdf',
    accent: '#FFFFFF',
    blurb:
      'The NYFW SS26 Issue captures fashion week from a perspective rarely seen — photographers, artists, stylists, and creatives who bring each show to life. Backstage chaos to artistic intimacy.',
  },
  {
    slug: 'isaiah-collins',
    number: '003',
    title: 'THE COMEDY KING',
    subtitle: 'Isaiah Collins • Featured Issue',
    subject: 'Isaiah Collins',
    year: '2025',
    month: 'August',
    price: '$25',
    cover: '/covers/cover-isaiah-collins-clear.jpg',
    collage: ['/covers/isaiah-bubba-1.jpg', '/covers/isaiah-bubba-5.jpg'],
    pdf: '/issues/isaiah-collins.pdf',
    accent: '#35E0FF',
    blurb:
      'Philly-born digital comedian @bubbacollins — whose honesty hits harder than any punchline. A masterclass in owning your narrative without losing your soul. Long live The Comedy King.',
  },
  {
    slug: 'eddie-cole',
    number: '002',
    title: 'THE COLE METHOD',
    subtitle: 'Eddie Cole • Featured Issue',
    subject: 'Eddie Cole',
    year: '2025',
    month: 'April',
    price: '$15',
    cover: '/covers/cover-eddie-cole-new.jpg',
    collage: ['/covers/collage-2.jpg', '/covers/eddie-cole-3.jpg'],
    pdf: '/issues/eddie-cole.pdf',
    accent: '#E10600',
    blurb:
      'Eddie Cole — a self-taught creative force from Minneapolis whose work blends fashion, photography, and storytelling. From styling out of necessity to building a community-centered studio.',
  },
  {
    slug: 'makenna',
    number: '001',
    title: 'THE MULTIFACETED MODEL',
    subtitle: 'Makenna Onyambu • Featured Issue',
    subject: 'Makenna Onyambu',
    year: '2025',
    month: 'February',
    price: '$15',
    cover: '/covers/cover-makenna-clear.jpg',
    collage: ['/covers/collage-5.jpg', '/covers/makenna-3.jpg'],
    pdf: '/issues/makenna.pdf',
    accent: '#FF2D8A',
    blurb:
      'From the runway to real life, Makenna Onyambu is redefining confidence, creativity, and the future of fashion. A model, a visionary, and a force — her journey is just beginning.',
  },
]

export function getIssue(slug: string) {
  return issues.find((i) => i.slug === slug)
}
