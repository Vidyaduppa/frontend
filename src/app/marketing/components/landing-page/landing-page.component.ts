import { Component, EventEmitter, HostListener, Output } from '@angular/core';

type LandingProduct = {
  name: string;
  description: string;
  badge: string;
  price: string;
};

type Testimonial = {
  name: string;
  location: string;
  quote: string;
  rating: number;
};

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  @Output() loginCta = new EventEmitter<void>();
  @Output() registerCta = new EventEmitter<void>();

  mobileMenuOpen = false;
  showBackToTop = false;

  readonly products: LandingProduct[] = [
    {
      name: 'Wild Forest Honey',
      description: 'Deep, floral notes harvested from pristine forest blooms.',
      badge: 'Raw',
      price: '₹499'
    },
    {
      name: 'Organic Multiflora',
      description: 'Balanced sweetness from diverse seasonal flowers.',
      badge: 'Organic',
      price: '₹549'
    },
    {
      name: 'Tulsi Infused Honey',
      description: 'Herbal warmth with a smooth tulsi finish.',
      badge: 'Infused',
      price: '₹649'
    },
    {
      name: 'Mustard Blossom Honey',
      description: 'Light, creamy texture with a gentle tang.',
      badge: 'Specialty',
      price: '₹599'
    }
  ];

  readonly benefits: Array<{ title: string; description: string }> = [
    { title: 'Natural Energy', description: 'A wholesome source of quick, clean fuel for your day.' },
    { title: 'Soothes & Comforts', description: 'Traditionally used to comfort the throat and calm coughs.' },
    { title: 'Antioxidant-Rich', description: 'Contains naturally occurring compounds that support wellness.' },
    { title: 'Gut-Friendly', description: 'May support digestion when enjoyed as part of a balanced diet.' }
  ];

  readonly testimonials: Testimonial[] = [
    {
      name: 'Aarav',
      location: 'Bengaluru',
      quote: 'The flavor is incredibly pure. You can taste the flowers—premium quality.',
      rating: 5
    },
    {
      name: 'Meera',
      location: 'Pune',
      quote: 'Smooth, rich, and not overly sweet. The tulsi infused one is my favorite.',
      rating: 5
    },
    {
      name: 'Rohit',
      location: 'Hyderabad',
      quote: 'Great packaging and fast delivery. The honey feels authentic and raw.',
      rating: 4
    }
  ];

  readonly year = new Date().getFullYear();

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showBackToTop = window.scrollY > 520;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
