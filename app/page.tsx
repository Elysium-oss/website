import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Articles } from "@/components/articles"
import { Newsletter } from "@/components/newsletter"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="bg-background">
      <Header />
      <Hero />
      <Services />
      <Articles />
      <Newsletter />
      <About />
      <Footer />
    </main>
  )
}
