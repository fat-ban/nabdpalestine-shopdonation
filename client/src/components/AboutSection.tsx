import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { MapPin, Users, Calendar, Globe } from "lucide-react";

const facts = [
  {
    icon: <MapPin className="w-6 h-6 text-blue-600" />,
    label: "Location",
    value: "Mediterranean Coast",
    description: "Strategic position connecting three continents"
  },
  {
    icon: <Users className="w-6 h-6 text-green-600" />,
    label: "Population",
    value: "2.3 Million",
    description: "One of the most densely populated areas in the world"
  },
  {
    icon: <Calendar className="w-6 h-6 text-purple-600" />,
    label: "History",
    value: "4000+ Years",
    description: "From ancient Philistines to modern Palestinian culture"
  },
  {
    icon: <Globe className="w-6 h-6 text-orange-600" />,
    label: "Languages",
    value: "Arabic, English",
    description: "Rich literary and oral traditions"
  }
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">About Gaza, Palestine</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A historic Mediterranean region with a vibrant cultural life and strong community traditions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-2xl mb-6">Cultural Significance</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Gaza has been continuously inhabited for over 4,000 years, making it one of the oldest cities 
                in the world. Throughout history, it has been a crucial stop on trade routes between Africa 
                and Asia, contributing to its diverse cultural heritage.
              </p>
              <p>
                The region is mentioned in ancient texts and has been home to Philistines, Romans, Byzantines, 
                Arabs, Crusaders, Ottomans, and modern Palestinians. Each civilization has left its mark on 
                Gaza's cultural landscape, creating a unique blend of traditions.
              </p>
              <p>
                Today's Gaza is characterized by strong family ties, community solidarity, and a deep 
                connection to Palestinian identity. Despite challenges, residents maintain rich cultural 
                traditions through daily life, celebrations, arts, and hospitality.
              </p>
              <p>
                The cultural scene includes traditional crafts like Tatreez embroidery, olive wood carving, 
                and pottery. Music and dance remain central to community life, with traditional Dabke 
                dancing and contemporary Palestinian music bridging generations.
              </p>
            </div>
          </div>

          <div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?w=400&h=500&fit=crop"
              alt="Gaza Mediterranean coastline"
              className="rounded-lg w-full h-64 object-cover mb-4"
            />
            <p className="text-sm text-muted-foreground text-center">
              Gaza's Mediterranean coastline has been a cultural crossroads for millennia
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facts.map((fact, index) => (
            <Card key={index} className="text-center p-6">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-3">
                  {fact.icon}
                </div>
                <div className="text-2xl mb-1">{fact.value}</div>
                <div className="text-sm mb-2">{fact.label}</div>
                <p className="text-xs text-muted-foreground">{fact.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-red-50 to-green-50 rounded-lg p-8">
          <h3 className="text-2xl mb-4 text-center">Cultural Values & Traditions</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="mb-2">Hospitality (Karam)</h4>
              <p className="text-sm text-muted-foreground">
                Welcoming guests with warmth, generosity, and the finest food available
              </p>
            </div>
            <div>
              <h4 className="mb-2">Solidarity (Sumud)</h4>
              <p className="text-sm text-muted-foreground">
                Community resilience and steadfastness in preserving cultural identity
              </p>
            </div>
            <div>
              <h4 className="mb-2">Heritage (Turath)</h4>
              <p className="text-sm text-muted-foreground">
                Passing down traditions, stories, and cultural practices through generations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}