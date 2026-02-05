import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tradie")({
  component: TradiePage,
});

function TradiePage() {
  // Gallery images - replace with your actual project photos
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = [
    {
      src: "https://scontent.fper11-1.fna.fbcdn.net/v/t39.30808-6/495670730_122096473058874447_7676698699897954352_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=_fMQYqdmow8Q7kNvwEqB2m5&_nc_oc=AdkVZ0RC5Zkp5hAzd-xTwPIfbaC3MMCbXAs0_PPYygtpTwlh_y5OhQwga9UZFAeXEbk&_nc_zt=23&_nc_ht=scontent.fper11-1.fna&_nc_gid=hWi2ygyM2jObokqbfrd9ow&oh=00_AfMqzOSld5j5Dzj2UVnyYiVr-r3YVS_Z-XqFVWBJAPP2_g&oe=686BB7E2",
      alt: "Digging a trench for plumbing",
    },
    {
      src: "https://scontent.fper11-1.fna.fbcdn.net/v/t39.30808-6/495627819_122096467322874447_934680808659128061_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=ByCzF70OW7UQ7kNvwEBoMc9&_nc_oc=AdmgQv8Qi61UhRj64wOUI3qUu4TWxv7Tj34IPNP5loVqsZtEEWeVi1I-dF_CQzy71Xg&_nc_zt=23&_nc_ht=scontent.fper11-1.fna&_nc_gid=9AaIuo3TCfmynzZlSnfbZg&oh=00_AfOb0L5J3FRmZ_bCgxpjukvLaPjQ7JckV5siR31IFO1EkQ&oe=686BB4AE",
      alt: "Tractor hauling mulch",
    },
    {
      src: "https://scontent.fper11-1.fna.fbcdn.net/v/t39.30808-6/495692320_122096482340874447_1419401132596994119_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=HuAzuHn1BYwQ7kNvwEg3UXn&_nc_oc=Adn1z50NYDb-Qm4O0R6JpQtaPBiGaYzZPAGIYed0MUiLZIRRfDicRYY1VbAVFkxTqJ8&_nc_zt=23&_nc_ht=scontent.fper11-1.fna&_nc_gid=PzK7KXAwcLuV99OZ5RXRGg&oh=00_AfOXgNtRopS1CtuMlyUF6KJKM43HsnrRFBFu0gO8z2Xv3g&oe=686BD775",
      alt: "Plants in back of a car",
    },
    {
      src: "https://scontent.fper11-1.fna.fbcdn.net/v/t39.30808-6/496512953_2866738630196869_8398256486367765358_n.jpg?stp=dst-jpg_tt6&cstp=mx1024x1024&ctp=s1024x1024&_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=QVlpEGohpC8Q7kNvwFB_foe&_nc_oc=Adlsr1gaarQWWw4U5Jy72_u7W-c6gvApNYIGfD3NW06gqDtELhDlmnQAFvBX6cOD73o&_nc_zt=23&_nc_ht=scontent.fper11-1.fna&_nc_gid=cJ7Ga1FfRt7Urh7KDVmD8w&oh=00_AfMnQ6CDsw9u67QgfQelTM5jIuOUlNMajByxoVcjvuOEOg&oe=686BC308",
      alt: "Company Logo",
    },
    {
      src: "https://scontent.fper11-1.fna.fbcdn.net/v/t39.30808-6/495984933_122096471870874447_7550168723051154924_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=6DU_tv2qsgoQ7kNvwHdMHrr&_nc_oc=Adn_qdkS0bKqkm4cUKN-NXZeBRzykSQlqsKIEGobBn8FgLYeKirApu-KxJqEvMxh2Hg&_nc_zt=23&_nc_ht=scontent.fper11-1.fna&_nc_gid=1q9Bhq8VN76i3qEyGcrlSQ&oh=00_AfNoX9YytiqmNP-RhugmZts2WOpl-KOZKb_DVAarmoiKpw&oe=686BD4CF",
      alt: "Stone wall construction",
    },
    {
      src: "https://scontent.fper11-1.fna.fbcdn.net/v/t39.30808-6/496681098_122096472986874447_4985860893882783166_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=E7gtrQOSCO4Q7kNvwHz5cxW&_nc_oc=AdnLCkksrsZ2CyWZdQjySDJYO-tw2_BV2nBgINRW_mS8IVEmU7SEEN0PDRTUJWYRfNk&_nc_zt=23&_nc_ht=scontent.fper11-1.fna&_nc_gid=_UlntVdJ2x6WPsv1yal-nw&oh=00_AfOuKF4rW2lcOjAsKZUvUPiX5BEACqPBsYrToHAAtW4a8w&oe=686BC235",
      alt: "Very Large Hole",
    },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground lg:py-20">
      {/* Header Section */}
      <section className="w-full flex flex-col items-left pt-8 gap-4 px-6">
        <div className="overflow-hidden">
          <span className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground transition-all duration-300 select-none block">
            <span className="inline">
              Jared Stanbrook - Your trusted local tradie
            </span>
          </span>
        </div>
        <hr className="w-full border-t-2 border-border" />
      </section>

      {/* Hero Section */}
      <section className="w-full flex flex-col md:flex-row items-start gap-8 px-6 py-12">
        <div className="flex flex-col justify-center w-full md:w-1/2">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Quality Work, Every Time
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            With over 5 years of experience in residential projects, I deliver
            reliable, high-quality workmanship that stands the test of time.
            From small repairs to major renovations, I've got you covered.
          </p>

          {/* Quick Contact Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now: [REDACTED_PHONE]
            </Button>
            <Button variant="outline" size="lg">
              <Mail className="w-4 h-4 mr-2" />
              Get Free Quote
            </Button>
          </div>
        </div>

        {/* Services Overview */}
        <div className="flex flex-col justify-center w-full md:w-1/2">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Services Offered
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Lawn mowing & edging",
              "Garden clean-ups & green waste removal",
              "Gutter cleaning (single-storey)",
              "Flat-pack furniture assembly",
              "Fence & gate repairs",
              "Patch & paint",
              "Pressure cleaning",
              "Hanging shelves & picture frames",
              "Door handle & hinge adjustments",
              "Reticulation repairs",
            ].map((service) => (
              <Badge
                key={service}
                variant="secondary"
                className="p-3 justify-start text-sm"
              >
                <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                <span className="text-left">{service}</span>
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="w-full py-12 px-6 bg-muted/20">
        <div className="w-full flex items-center justify-center mb-8">
          <span className="text-xl font-semibold tracking-widest text-foreground mr-4">
            Contact
          </span>
          <hr className="w-full border-t-2 border-border" />
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2 text-foreground">Phone</h3>
              <p className="text-foreground font-medium">[REDACTED_PHONE]</p>
              <p className="text-sm text-muted-foreground mt-1">
                Available 7am - 6pm
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2 text-foreground">Email</h3>
              <p className="text-foreground font-medium">
                jared.stanbrook@outlook.com
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Response within the day
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2 text-foreground">
                Service Area
              </h3>
              <p className="text-foreground font-medium">
                Perth Eastern Suburbs
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Free quotes within 20km
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Work Gallery */}
      <section className="w-full py-12 px-6">
        <div className="w-full flex items-center justify-center mb-8">
          <span className="text-xl font-semibold tracking-widest text-foreground mr-4">
            Recent Work
          </span>
          <hr className="w-full border-t-2 border-border" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={galleryImages[currentImageIndex].src}
                alt={galleryImages[currentImageIndex].alt}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gallery Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full transition-all border"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full transition-all border"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 text-foreground px-3 py-1 rounded-full text-sm border">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex gap-2 mt-6 justify-center overflow-x-auto pb-2">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? "border-primary"
                    : "border-border opacity-60 hover:opacity-80"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Me */}
      <section className="w-full py-8 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            Why Choose Me?
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <Star className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">5-Star Service</h3>
              <p className="text-sm text-muted-foreground">
                Consistently rated excellent by clients
              </p>
            </div>

            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">On-Time Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Projects completed when promised
              </p>
            </div>

            <div className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-sm text-muted-foreground">
                Workmanship you can trust, every time
              </p>
            </div>

            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Locally Owned</h3>
              <p className="text-sm text-muted-foreground">
                Proudly serving your community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Don't wait for small problems to become big ones. Contact me today for
          a free quote and let's discuss your project.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Phone className="w-4 h-4 mr-2" />
            Call [REDACTED_PHONE]
          </Button>
          <Button variant="outline" size="lg">
            <Mail className="w-4 h-4 mr-2" />
            Email for Quote
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 px-4 border-t mt-auto">
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Jared Stanbrook | ABN: 62 385 109 727</p>
          <p className="mt-1">
            Serving Perth Eastern Suburbs & Surrounding Areas
          </p>
        </div>
      </footer>
    </div>
  );
}
