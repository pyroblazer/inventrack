//apps/web-landing-page/src/app/page.tsx
import { Container } from "@shared/ui/components/landing-page/container";
import { BorderBeam } from "@shared/ui/components/landing-page/custom-ui/border-beam";
import { LampContainer } from "@shared/ui/components/landing-page/custom-ui/lamp";
import { Marquee } from "@shared/ui/components/landing-page/custom-ui/marquee";
import { SectionBadge } from "@shared/ui/components/landing-page/custom-ui/section-badge";
import { Footer } from "@shared/ui/components/landing-page/footer";
import { Icons } from "@shared/ui/components/landing-page/icons";
import { Navbar } from "@shared/ui/components/landing-page/navbar";
import { Wrapper } from "@shared/ui/components/landing-page/wrapper";
import { Button } from "@shared/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/ui/card";
import { Input } from "@shared/ui/components/ui/input";
import { cn } from "@shared/ui/lib/utils";
import { ArrowRight, ChevronRight, UserIcon, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { features, perks, pricingCards, reviews } from "../constants";
import { isUserLoggerIn } from "../helpers/logged-in-user";
import {
  type Feature,
  type Perk,
  type PricingCard,
  type Review,
} from "../types";

export default async function Home(): Promise<React.ReactNode> {
  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);

  const userLoggedIn = await isUserLoggerIn();

  return (
    <div className="flex flex-col items-center w-full">
      <Navbar isUserLoggedIn={userLoggedIn} />
      <section className="w-full relative flex items-center justify-center flex-col px-4 md:px-0 pt-8 ">
        {/* hero */}
        <Wrapper>
          <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10 h-[150vh]" />

          <Container>
            <div className="flex flex-col items-center justify-center py-20 h-full">
              <button
                type="button"
                className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200"
              >
                <span>
                  <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                </span>
                <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
                <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/40" />
                <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center justify-center gap-1.5">
                  📦 Introducing Inventrack
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>

              <div className="flex flex-col items-center mt-8 max-w-3xl w-11/12 md:w-full">
                <h1 className="text-4xl md:text-6xl lg:textxl md:!leading-snug font-semibold text-center bg-clip-text bg-gradient-to-b from-gray-50 to-gray-50 text-transparent">
                  Smart Inventory & Booking Management Made Simple
                </h1>
                <p className="text-base md:text-lg text-foreground/80 mt-6 text-center">
                  Streamline your team's resource management with intelligent
                  inventory tracking, seamless booking system, and powerful
                  analytics - all in one platform.
                </p>
                <div className="hidden md:flex relative items-center justify-center mt-8 md:mt-12 w-full">
                  <Link
                    className="flex items-center justify-center w-max rounded-full border-t border-foreground/30 bg-white/20 backdrop-blur-lg px-2 py-1 md:py-2 gap-2 md:gap-8 shadow-3xl shadow-background/40 cursor-pointer select-none"
                    href="#"
                  >
                    <p className="text-foreground text-sm text-center md:text-base font-medium pl-4 pr-4 lg:pr-0">
                      📦 {"  "} Start managing your inventory smarter today!
                    </p>
                    <Button
                      className="rounded-full hidden lg:flex border border-foreground/20"
                      size="sm"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative flex items-center justify-center py-10 md:py-20 w-full">
                <div className="absolute top-1/2 left-1/2 -z-10 gradient w-3/4 -translate-x-1/2 h-3/4 -translate-y-1/2 inset-0 blur-[10rem]" />
                <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-opacity-50 backdrop-blur-3xl">
                  <div className="rounded-md lg:rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 shadow-2xl ring-1 ring-border h-[400px] w-[800px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icons.Monitor className="w-12 h-12 text-primary" />
                      </div>
                      <p className="text-lg font-medium">Dashboard Preview</p>
                      <p className="text-sm">
                        Interactive inventory management interface
                      </p>
                    </div>
                  </div>

                  <BorderBeam delay={9} duration={12} size={250} />
                </div>
              </div>
            </div>
          </Container>
        </Wrapper>

        {/* how it works */}
        <section id={"how-it-works"}>
          <Wrapper className="flex flex-col items-center justify-center pt-20 relative">
            <Container>
              <div className="max-w-md mx-auto text-start md:text-center">
                <SectionBadge title="The Process" />
                <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
                  Three steps to streamline your inventory
                </h2>
                <p className="text-muted-foreground mt-6">
                  Transform your resource management in just 3 simple steps
                </p>
              </div>
            </Container>
            <Container>
              <div className="flex flex-col items-center justify-center py-10 md:py-20 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full divide-x-0 md:divide-x divide-y md:divide-y-0 divide-gray-900 first:border-l-2 lg:first:border-none first:border-gray-900">
                  {perks.map((perk: Perk) => (
                    <div
                      className="flex flex-col items-start px-4 md:px-6 lg:px-8 lg:py-6 py-4"
                      key={perk.title}
                    >
                      <div className="flex items-center justify-center">
                        <perk.Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-medium mt-4">{perk.title}</h3>
                      <p className="text-muted-foreground mt-2 text-start lg:text-start">
                        {perk.info}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </Wrapper>
        </section>

        {/* features */}
        <section id={"features"}>
          <Wrapper className="flex flex-col items-center justify-center pt-20 relative">
            <div className="hidden md:block absolute top-0 -right-1/3 w-72 h-72 bg-primary rounded-full blur-[10rem] -z-10" />
            <div className="hidden md:block absolute bottom-0 -left-1/3 w-72 h-72 bg-indigo-600 rounded-full blur-[10rem] -z-10" />
            <Container>
              <div className="max-w-md mx-auto text-start md:text-center">
                <SectionBadge title="Features" />
                <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
                  Powerful features for modern teams
                </h2>
                <p className="text-muted-foreground mt-6">
                  Inventrack offers comprehensive tools to manage inventory,
                  track bookings, and optimize resource utilization
                </p>
              </div>
            </Container>
            <Container>
              <div className="flex items-center justify-center mx-auto mt-8">
                <Icons.Feature className="w-auto h-80" />
              </div>
            </Container>
            <Container>
              <div className="flex flex-col items-center justify-center py-10 md:py-20 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-8">
                  {features.map((feature: Feature) => (
                    <div
                      className="flex flex-col items-start lg:items-start px-0 md:px-0"
                      key={feature.title}
                    >
                      <div className="flex items-center justify-center">
                        <feature.Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-medium mt-4">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground mt-2 text-start lg:text-start">
                        {feature.info}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </Wrapper>
        </section>

        {/* pricing */}
        <section id={"pricing"}>
          <Wrapper className="flex flex-col items-center justify-center pt-20 relative">
            <div className="hidden md:block absolute top-0 -right-1/3 w-72 h-72 bg-blue-500 rounded-full blur-[10rem] -z-10" />
            <Container>
              <div className="max-w-md mx-auto text-start md:text-center">
                <SectionBadge title="Pricing" />
                <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
                  Choose the perfect plan for your team
                </h2>
                <p className="text-muted-foreground mt-6">
                  From small teams to enterprise organizations, we have the
                  right solution to optimize your inventory management
                </p>
              </div>
            </Container>
            <Container className="flex items-center justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full md:gap-8 py-10 md:py-20 flex-wrap max-w-4xl">
                {pricingCards.map((card: PricingCard) => (
                  <Card
                    className={cn(
                      "flex flex-col w-full border-neutral-700",
                      card.title === "Professional" &&
                        "border-2 border-primary",
                    )}
                    key={card.title}
                  >
                    <CardHeader className="border-b border-border">
                      <span>{card.title}</span>
                      <CardTitle
                        className={cn(
                          card.title !== "Professional" &&
                            "text-muted-foreground",
                        )}
                      >
                        {card.price}
                      </CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                      {card.features.map((feature: string) => (
                        <div className="flex items-center gap-2" key={feature}>
                          <CheckCircle className="w-4 h-4 fill-primary text-primary" />
                          <p>{feature}</p>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Link
                        className={cn(
                          "w-full text-center text-primary-foreground bg-primary p-2 rounded-md text-sm font-medium",
                          card.title !== "Professional" &&
                            "!bg-foreground !text-background",
                        )}
                        href="#"
                      >
                        {card.buttonText}
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </Container>
          </Wrapper>
        </section>

        {/* testimonials */}
        <Wrapper className="flex flex-col items-center justify-center pt-20 relative">
          <div className="hidden md:block absolute -top-1/4 -left-1/3 w-72 h-72 bg-indigo-500 rounded-full blur-[10rem] -z-10" />
          <Container>
            <div className="max-w-md mx-auto text-start md:text-center">
              <SectionBadge title="Success Stories" />
              <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
                What teams are saying
              </h2>
              <p className="text-muted-foreground mt-6">
                Discover how Inventrack transforms inventory management for
                creative agencies, tech teams, and organizations worldwide
              </p>
            </div>
          </Container>
          <Container>
            <div className="py-10 md:py-20 w-full">
              <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden py-10">
                <Marquee className="[--duration:20s] select-none" pauseOnHover>
                  {firstRow.map((review: Review) => (
                    <figure
                      className={cn(
                        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                        "border-zinc-50/[.1] bg-background over:bg-zinc-50/[.15]",
                      )}
                      key={review.name}
                    >
                      <div className="flex flex-row items-center gap-2">
                        <UserIcon className="w-6 h-6" />
                        <div className="flex flex-col">
                          <figcaption className="text-sm font-medium">
                            {review.name}
                          </figcaption>
                          <p className="text-xs font-medium text-muted-foreground">
                            {review.username}
                          </p>
                        </div>
                      </div>
                      <blockquote className="mt-2 text-sm">
                        {review.body}
                      </blockquote>
                    </figure>
                  ))}
                </Marquee>
                <Marquee
                  className="[--duration:20s] select-none"
                  pauseOnHover
                  reverse
                >
                  {secondRow.map((review: Review) => (
                    <figure
                      className={cn(
                        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                        "border-zinc-50/[.1] bg-background over:bg-zinc-50/[.15]",
                      )}
                      key={review.name}
                    >
                      <div className="flex flex-row items-center gap-2">
                        <UserIcon className="w-6 h-6" />
                        <div className="flex flex-col">
                          <figcaption className="text-sm font-medium">
                            {review.name}
                          </figcaption>
                          <p className="text-xs font-medium text-muted-foreground">
                            {review.username}
                          </p>
                        </div>
                      </div>
                      <blockquote className="mt-2 text-sm">
                        {review.body}
                      </blockquote>
                    </figure>
                  ))}
                </Marquee>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background" />
              </div>
            </div>
          </Container>
        </Wrapper>

        {/* newsletter */}
        <section id={"newsletter"}>
          <Wrapper className="flex flex-col items-center justify-center pt-20 relative">
            <LampContainer>
              <div className="flex flex-col items-center justify-center relative w-full text-center ">
                <h2 className="text-4xl lg:text-5xl xl:text-6xl lg:!leading-snug font-semibold mt-8">
                  From Chaos to Control <br /> In Minutes, Not Hours
                </h2>
                <p className="text-muted-foreground mt-6 max-w-md mx-auto">
                  Transform your inventory management with Inventrack&apos;s
                  intelligent booking system and real-time analytics
                </p>
                <Button asChild className="mt-6" variant="link">
                  <Link href="/sign-in">
                    Start free trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </LampContainer>
            <Container className="relative z-[999999]">
              <div className="flex items-center justify-center w-full -mt-40">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between w-full px-4 md:px-8 rounded-lg lg:rounded-2xl border border-border/80 py-4 md:py-8">
                  <div className="flex flex-col items-start gap-4 w-full">
                    <h4 className="text-xl md:text-2xl font-semibold">
                      Stay updated
                    </h4>
                    <p className="text-base text-muted-foreground">
                      Get the latest features and inventory management tips
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 md:min-w-80 mt-5 md:mt-0 w-full md:w-max">
                    <form
                      action="#"
                      className="flex flex-col md:flex-row items-center gap-2 w-full md:max-w-xs"
                    >
                      <Input
                        className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-primary duration-300 w-full"
                        placeholder="Enter your email"
                        required
                        type="email"
                      />
                      <Button
                        className="w-full md:w-max"
                        size="sm"
                        type="submit"
                        variant="secondary"
                      >
                        Subscribe
                      </Button>
                    </form>
                    <p className="text-xs text-muted-foreground">
                      By subscribing you agree with our{" "}
                      <Link href="#">Privacy Policy</Link>
                    </p>
                  </div>
                </div>
              </div>
            </Container>
          </Wrapper>
        </section>
      </section>
      <Footer />
    </div>
  );
}
