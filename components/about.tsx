"use client"

export function About() {
  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-muted rounded-full blur-3xl opacity-10 -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h2 className="font-display font-bold text-5xl sm:text-6xl text-foreground mb-4">
            Our <span className="text-muted-foreground">Mission</span>
          </h2>
          <p className="text-lg text-foreground font-semibold">Simplify complexity. Build with purpose.</p>
        </div>

        <div className="space-y-6 mb-16 bg-muted rounded-2xl p-8 border border-border">
          <p className="text-base text-muted-foreground leading-relaxed">
            At Elysium, we're dedicated to advancing Web3 through rigorous research and production-grade development.
            Our work spans protocol analysis, infrastructure design, and application development—all guided by a
            singular belief: that technical excellence and clear communication are non-negotiable.
          </p>

          <p className="text-base text-muted-foreground leading-relaxed">
            We believe Web3's potential is only realized through technical credibility. Too much of the space is
            shrouded in unnecessary complexity or disconnected from reality. We cut through the noise with research that
            educates and development that delivers measurable results.
          </p>

          <p className="text-base text-muted-foreground leading-relaxed">
            Whether you're an emerging protocol seeking technical credibility, an enterprise exploring decentralized
            systems, or a developer wanting to level up—we partner with teams who are serious about building the future.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative p-6 rounded-2xl border-2 border-border bg-background hover:border-foreground hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-8 bg-foreground rounded-r" />
            <div className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-2">500+</div>
            <p className="text-muted-foreground text-sm">Articles Published</p>
          </div>
          <div className="relative p-6 rounded-2xl border-2 border-border bg-background hover:border-foreground hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-8 bg-foreground rounded-r" />
            <div className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-2">50K+</div>
            <p className="text-muted-foreground text-sm">Active Subscribers</p>
          </div>
          <div className="relative p-6 rounded-2xl border-2 border-border bg-background hover:border-foreground hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-8 bg-foreground rounded-r" />
            <div className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-2">100+</div>
            <p className="text-muted-foreground text-sm">Projects Delivered</p>
          </div>
        </div>
      </div>
    </section>
  )
}
