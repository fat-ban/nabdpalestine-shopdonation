import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const events = [
  {
    id: 1,
    title: "Traditional Oud Concert",
    description: "Evening of classical Palestinian music featuring master oud players",
    date: "March 15, 2024",
    time: "7:00 PM",
    venue: "Gaza Cultural Center",
    category: "Music",
    attendees: 150,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
    price: "Free"
  },
  {
    id: 2,
    title: "Palestinian Embroidery Workshop",
    description: "Learn the traditional art of Tatreez with local artisans",
    date: "March 18, 2024",
    time: "2:00 PM",
    venue: "Women's Cultural Society",
    category: "Arts & Crafts",
    attendees: 25,
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=250&fit=crop",
    price: "20 NIS"
  },
  {
    id: 3,
    title: "Gaza Poetry Night",
    description: "Contemporary Palestinian poets sharing their work",
    date: "March 22, 2024",
    time: "6:30 PM",
    venue: "Al-Mathaf Hotel",
    category: "Literature",
    attendees: 80,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    price: "Free"
  },
  {
    id: 4,
    title: "Dabke Dance Performance",
    description: "Traditional Palestinian folk dance by Gaza Dabke Troupe",
    date: "March 25, 2024",
    time: "8:00 PM",
    venue: "Beach Cultural Center",
    category: "Dance",
    attendees: 200,
    image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&h=250&fit=crop",
    price: "15 NIS"
  },
  {
    id: 5,
    title: "Palestinian Cuisine Festival",
    description: "Taste traditional dishes and learn cooking techniques",
    date: "March 28, 2024",
    time: "12:00 PM",
    venue: "Gaza Old City",
    category: "Food",
    attendees: 300,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop",
    price: "25 NIS"
  },
  {
    id: 6,
    title: "Contemporary Art Exhibition",
    description: "Local artists showcase modern Palestinian perspectives",
    date: "March 30, 2024",
    time: "10:00 AM",
    venue: "Gaza Fine Arts Gallery",
    category: "Visual Arts",
    attendees: 120,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop",
    price: "10 NIS"
  }
];

const categoryColors: Record<string, string> = {
  "Music": "bg-blue-100 text-blue-800",
  "Arts & Crafts": "bg-purple-100 text-purple-800",
  "Literature": "bg-green-100 text-green-800",
  "Dance": "bg-red-100 text-red-800",
  "Food": "bg-orange-100 text-orange-800",
  "Visual Arts": "bg-pink-100 text-pink-800"
};

export function EventsSection() {
  return (
    <section id="events" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Upcoming Cultural Events</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join us in celebrating Palestinian culture through music, art, dance, and community gatherings
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <ImageWithFallback
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <Badge 
                  className={`absolute top-3 left-3 ${categoryColors[event.category]}`}
                >
                  {event.category}
                </Badge>
              </div>
              
              <CardHeader>
                <h3 className="text-lg mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.venue}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendees} expected attendees
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-center">
                <span className="font-semibold text-lg text-green-600">{event.price}</span>
                <Button size="sm">Learn More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}