import ClientHome from '@/components/client-home'

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Project Cards */}
        <div className="rounded-lg p-6 bg-card border">
          <h2 className="text-2xl font-semibold mb-4">TensorForest</h2>
          <p className="text-muted-foreground mb-4">
            Autonomous drone system for wildfire prediction and prevention using AI and remote sensing.
          </p>
          <a 
            href="/projects/tensorforest" 
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            View Project
          </a>
        </div>
        
        <div className="rounded-lg p-6 bg-card border">
          <h2 className="text-2xl font-semibold mb-4">Apocalypse Hacks</h2>
          <p className="text-muted-foreground mb-4">
            Canada's largest high school hackathon, bringing together 150+ students to build amazing projects.
          </p>
          <a 
            href="/projects/apocalypse-hacks" 
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            View Project
          </a>
        </div>
      </div>
    </div>
  )
}
