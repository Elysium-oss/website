"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface Project {
  id: string
  title: string
  description: string
  excerpt: string
  category: string
  techStack: string[]
  year: string
  role: string
  image?: string
  link?: string
}

const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Protocol Analytics Dashboard",
    description: "Real-time monitoring and analysis platform for blockchain protocols",
    excerpt:
      "Built a comprehensive dashboard enabling protocol teams to monitor network health, validator performance, and economic metrics in real-time with custom alerts.",
    category: "DeFi Infrastructure",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "WebSockets", "Tailwind"],
    year: "2025",
    role: "Full-stack Developer",
  },
  {
    id: "2",
    title: "Smart Contract Audit Platform",
    description: "Automated security analysis and vulnerability detection for Solidity contracts",
    excerpt:
      "Developed an intelligent platform combining static analysis with machine learning to identify common smart contract vulnerabilities and provide remediation guidance.",
    category: "Security",
    techStack: ["Rust", "Solidity", "Python", "React", "GraphQL"],
    year: "2024",
    role: "Backend Lead",
  },
  {
    id: "3",
    title: "Cross-Chain Bridge Protocol",
    description: "Trustless liquidity bridge connecting Ethereum and Solana ecosystems",
    excerpt:
      "Engineered a novel cross-chain messaging protocol enabling secure, capital-efficient bridging between heterogeneous blockchains with sub-second finality.",
    category: "Interoperability",
    techStack: ["Solidity", "Rust", "Anchor", "TypeScript", "Foundry"],
    year: "2024",
    role: "Smart Contract Architect",
  },
  {
    id: "4",
    title: "Governance DAO Framework",
    description: "Flexible governance protocol for decentralized autonomous organizations",
    excerpt:
      "Created a modular governance framework supporting complex voting mechanisms, proposal workflows, and treasury management for community-governed protocols.",
    category: "Governance",
    techStack: ["Solidity", "OpenZeppelin", "Hardhat", "React", "The Graph"],
    year: "2024",
    role: "Smart Contract Developer",
  },
  {
    id: "5",
    title: "MEV-Resistant Order Router",
    description: "Privacy-preserving DEX router minimizing front-running and sandwich attacks",
    excerpt:
      "Implemented a novel order routing system using threshold encryption and encrypted mempools to protect users from maximal extractable value exploitation.",
    category: "Security",
    techStack: ["Solidity", "Threshold Cryptography", "MEV-Burn", "Anvil", "TypeScript"],
    year: "2024",
    role: "Protocol Designer",
  },
  {
    id: "6",
    title: "Staking Derivative Protocol",
    description: "Liquid staking protocol enabling capital efficiency for validators",
    excerpt:
      "Built a staking derivative platform allowing users to stake assets while maintaining liquidity through receipt tokens, enabling sophisticated DeFi strategies.",
    category: "DeFi Infrastructure",
    techStack: ["Solidity", "Curve", "Lido", "Hardhat", "Next.js"],
    year: "2023",
    role: "Full-stack Developer",
  },
]

const CATEGORIES = ["All", "DeFi Infrastructure", "Security", "Interoperability", "Governance"]

export default function DevelopmentPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProjects =
    selectedCategory === "All" ? PROJECTS : PROJECTS.filter((project) => project.category === selectedCategory)

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 min-h-screen">
        {/* Split Layout */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Sidebar - Header and Filters */}
          <aside className="lg:w-1/2 lg:border-r lg:border-border lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="px-6 sm:px-8 lg:px-12 lg:py-16 py-8 lg:pr-16">
              <div className="mb-12">
                <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-4">DEVELOPMENT</p>
                <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight mb-6 text-balance">
                  Production-Ready Solutions for Web3
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  From protocol design to dApp development, we build scalable, secure infrastructure that powers the
                  decentralized future.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-3">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-foreground text-white border border-foreground"
                        : "bg-transparent border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {selectedCategory === category && "◆ "}
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Content - Projects List */}
          <section className="lg:w-1/2 lg:px-12 lg:py-16 px-6 sm:px-8 py-8">
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <a key={project.id} href={project.link || "#"} className="group block">
                  <div className="p-5 rounded-lg border border-border hover:border-foreground transition-all duration-300 bg-background hover:bg-muted/30">
                    {/* Project Header */}
                    <div className="mb-4 flex items-start gap-4">
                      <div className="flex-grow min-w-0">
                        <div className="mb-2 flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 text-xs font-semibold text-foreground bg-muted rounded-full group-hover:bg-foreground group-hover:text-white transition-all">
                            {project.category}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">{project.year}</span>
                        </div>

                        <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground mb-2 transition-colors line-clamp-2 leading-tight">
                          {project.title}
                        </h2>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{project.excerpt}</p>
                      </div>

                      {/* Project Image Placeholder - Smaller */}
                      <div className="hidden lg:block flex-shrink-0 w-20 h-20 rounded-md bg-muted flex items-center justify-center border border-border group-hover:border-foreground transition-colors">
                        <svg
                          className="w-8 h-8 text-foreground opacity-40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Tech Stack - Compact */}
                    <div className="mb-3 pb-3 border-t border-border pt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs font-medium text-foreground bg-muted rounded-md border border-border group-hover:border-foreground transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 5 && (
                          <span className="px-2 py-1 text-xs font-medium text-muted-foreground">
                            +{project.techStack.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{project.role}</span>
                      <span className="text-foreground group-hover:translate-x-1 transition-transform font-medium">
                        View →
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">Ready to Build?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let's collaborate on your next Web3 project. From concept to production, we deliver.
            </p>
            <button className="px-8 py-3 rounded-lg text-white font-medium bg-foreground hover:bg-accent-hover shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all">
              Start a Project
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
