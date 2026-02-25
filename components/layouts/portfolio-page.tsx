"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRightIcon,
  DownloadIcon,
  ExternalLinkIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  type ContactFormValues,
  contactFormSchema,
  projects,
  skills,
  testimonials,
  timeline,
} from "@/lib/portfolio-data";
import { downloadTextFile, scrollToId } from "@/lib/portfolio-utils";

function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        `mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8`,
        className
      )}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string | null;
}) {
  return (
    <div className={`flex flex-col gap-3`}>
      {eyebrow ? (
        <p className={`text-sm font-medium tracking-wide text-muted-foreground`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`text-2xl font-semibold tracking-tight sm:text-3xl`}>
        {title}
      </h2>
      {description ? (
        <p className={`max-w-2xl text-base leading-relaxed text-muted-foreground`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function HeroVisual({
  src,
  alt,
  attribution,
}: {
  src: string;
  alt: string;
  attribution: { name: string; url: string };
}) {
  return (
    <div className={`relative`}>
      <div
        className={cn(
          `relative overflow-hidden rounded-2xl border bg-card shadow-sm`,
          `aspect-video`
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes={`(min-width: 1024px) 560px, 100vw`}
          className={`object-cover`}
        />
        <div
          className={cn(
            `pointer-events-none absolute inset-0`,
            `bg-gradient-to-tr from-background/30 via-background/0 to-background/40`
          )}
        />
      </div>
      <p className={`mt-3 text-xs text-muted-foreground`}>
        Photo by{" "}
        <a
          href={attribution.url}
          target={`_blank`}
          rel={`noreferrer`}
          className={`underline underline-offset-4 hover:text-foreground`}
        >
          {attribution.name} on Unsplash
        </a>
      </p>
    </div>
  );
}

function ProjectDialog({
  title,
  description,
  tags,
}: {
  title: string;
  description: string;
  tags: string[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={`outline`} size={`sm`}>
          Details <ArrowRightIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-2xl`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className={`flex flex-wrap gap-2`}>
          {tags.map((t) => (
            <Badge key={t} variant={`secondary`}>
              {t}
            </Badge>
          ))}
        </div>
        <div className={`grid gap-4 text-sm text-muted-foreground`}>
          <p>
            This is a portfolio-ready case study modal. Replace the copy with your
            actual scope, constraints, approach, and results. If you have metrics,
            add them here.
          </p>
          <ul className={`list-disc pl-5`}>
            <li>Problem → goals and success criteria</li>
            <li>Process → discovery, iterations, decisions</li>
            <li>Outcome → what shipped and what improved</li>
          </ul>
        </div>
        <div className={`flex flex-wrap gap-2 pt-2`}>
          <Button
            onClick={() =>
              toast.message(`Add real links`, {
                description: `Hook this up to your live demo / repo URL.`,
              })
            }
          >
            Live Demo <ExternalLinkIcon />
          </Button>
          <Button
            variant={`secondary`}
            onClick={() =>
              toast.message(`Add real links`, {
                description: `Hook this up to your GitHub repository URL.`,
              })
            }
          >
            Source Code <GithubIcon />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PortfolioPage() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedTag, setSelectedTag] = useLocalStorage<string>(
    `portfolio:selected-tag`,
    `All`
  );
  const [contactDraft, setContactDraft] = useLocalStorage<ContactFormValues>(
    `portfolio:contact-draft`,
    {
      name: ``,
      email: ``,
      message: ``,
    }
  );

  const tags = [`All`, ...Array.from(new Set(projects.flatMap((p) => p.tags)))];

  const filteredProjects =
    selectedTag === `All`
      ? projects
      : projects.filter((p) => p.tags.includes(selectedTag));

  const animation = {
    initial: shouldReduceMotion ? undefined : { opacity: 0, y: 12 },
    whileInView: shouldReduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: `-80px` },
    transition: { duration: 0.5, ease: `easeOut` },
  } as const;

  function onDownloadResume() {
    const text =
      `Abdul Sayyed — Resume (Template)\n` +
      `\n` +
      `Summary\n` +
      `Product-focused designer/developer who ships clean UI and reliable engineering.\n` +
      `\n` +
      `Skills\n` +
      `${skills.map((s) => `- ${s.title}: ${s.description}`).join(`\n`)}\n` +
      `\n` +
      `Experience\n` +
      `${timeline.map((t) => `- ${t.title}: ${t.description}`).join(`\n`)}`;

    downloadTextFile(`Abdul-Sayyed-Resume.txt`, text);
    toast.success(`Resume downloaded`, {
      description: `A template resume file was generated. Replace it with your real PDF when ready.`,
    });
  }

  function onEmailMe() {
    const subject = encodeURIComponent(`Project inquiry`);
    const body = encodeURIComponent(
      `Hi Abdul,\n\nI’d like to discuss a project. Here are the details:\n\n- Timeline:\n- Budget:\n- Goals:\n\nThanks!`
    );
    window.location.href = `mailto:yourname@email.com?subject=${subject}&body=${body}`;
  }

  function onSubmitContact(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactFormSchema.safeParse(contactDraft);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? `Please fix the form.`;
      toast.error(`Invalid form`, { description: message });
      return;
    }

    toast.success(`Message ready`, {
      description: `This demo does not send emails. Use the “Email Me” button or wire up a real endpoint later.`,
    });
  }

  return (
    <div id={`top`} className={`min-h-dvh bg-background text-foreground`}>
      <header
        className={cn(
          `sticky top-0 z-50 border-b bg-background/75 backdrop-blur supports-[backdrop-filter]:bg-background/55`
        )}
      >
        <Container className={`py-3`}>
          <div className={`flex items-center justify-between gap-3`}>
            <div className={`flex items-center gap-3`}>
              <div
                className={cn(
                  `grid size-10 place-items-center rounded-xl border bg-card`,
                  `shadow-sm`
                )}
                aria-hidden
              >
                <span className={`text-lg font-semibold`}>AS</span>
              </div>
              <div className={`leading-tight`}>
                <p className={`font-semibold tracking-tight`}>Abdul Sayyed</p>
                <p className={`text-xs text-muted-foreground`}>Portfolio</p>
              </div>
            </div>

            <nav className={`hidden items-center gap-1 md:flex`} aria-label={`Primary`}>
              {[
                { id: `about`, label: `About` },
                { id: `projects`, label: `Projects` },
                { id: `skills`, label: `Skills` },
                { id: `experience`, label: `Experience` },
                { id: `testimonials`, label: `Testimonials` },
                { id: `contact`, label: `Contact` },
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={`ghost`}
                  size={`sm`}
                  onClick={() => scrollToId(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </nav>

            <div className={`flex items-center gap-2`}>
              <Button
                className={`hidden sm:inline-flex`}
                onClick={() => scrollToId(`projects`)}
              >
                View Projects <ArrowRightIcon />
              </Button>
              <Button variant={`outline`} onClick={() => scrollToId(`contact`)}>
                Contact
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <main>
        <section className={`relative overflow-hidden`}>
          <div
            className={cn(
              `pointer-events-none absolute inset-0`,
              `bg-[radial-gradient(90%_60%_at_10%_0%,hsl(var(--primary))/_0.25,transparent_55%)]`
            )}
          />
          <Container className={`py-14 sm:py-18 lg:py-22`}>
            <div className={`grid items-center gap-10 lg:grid-cols-2`}>
              <motion.div {...animation} className={`flex flex-col gap-6`}>
                <div className={`flex flex-wrap items-center gap-2`}>
                  <Badge variant={`secondary`}>Designer</Badge>
                  <Badge variant={`secondary`}>Developer</Badge>
                  <Badge variant={`secondary`}>Problem Solver</Badge>
                </div>

                <div className={`flex flex-col gap-3`}>
                  <h1
                    className={cn(
                      `text-4xl font-semibold tracking-tight sm:text-5xl`,
                      `leading-[1.05]`
                    )}
                  >
                    I build clean, fast, and delightful digital experiences.
                  </h1>
                  <p className={`text-base leading-relaxed text-muted-foreground`}>
                    I help teams turn ideas into polished products—through thoughtful
                    UX, modern UI, and reliable engineering. Available for freelance
                    and full-time opportunities.
                  </p>
                </div>

                <div className={`flex flex-wrap gap-3`}>
                  <Button variant={`secondary`} onClick={onDownloadResume}>
                    Download Resume <DownloadIcon />
                  </Button>
                  <Button onClick={() => scrollToId(`projects`)}>
                    See Case Studies <ArrowRightIcon />
                  </Button>
                </div>

                <div className={`grid gap-3 rounded-2xl border bg-card p-5`}>
                  <p className={`text-sm font-medium`}>Highlights</p>
                  <p className={`text-sm text-muted-foreground`}>
                    Product design • Frontend engineering • Design systems •
                    Performance optimization
                  </p>
                </div>
              </motion.div>

              <motion.div {...animation} className={`lg:pl-6`}>
                <HeroVisual
                  src={`/assets/unsplash/portfolio-hero.jpg`}
                  alt={`Hero visual / product montage`}
                  attribution={{
                    name: `Jakub Żerdzicki`,
                    url: `https://unsplash.com/@jakubzerdzicki?utm_source=nexusai&utm_medium=referral`,
                  }}
                />
              </motion.div>
            </div>
          </Container>
        </section>

        <section id={`about`} className={`scroll-mt-24`}>
          <Container className={`py-14 sm:py-18`}>
            <div className={`grid items-center gap-10 lg:grid-cols-2`}>
              <motion.div {...animation} className={`order-2 lg:order-1`}>
                <div className={`relative overflow-hidden rounded-2xl border bg-card`}>
                  <div className={`relative aspect-[16/10]`}>
                    <Image
                      src={`/assets/unsplash/about-workspace.jpg`}
                      alt={`Workspace / about image`}
                      fill
                      sizes={`(min-width: 1024px) 560px, 100vw`}
                      className={`object-cover`}
                    />
                    <div
                      className={cn(
                        `pointer-events-none absolute inset-0`,
                        `bg-gradient-to-t from-background/45 via-background/0 to-background/25`
                      )}
                    />
                  </div>
                </div>
                <p className={`mt-3 text-xs text-muted-foreground`}>
                  Photo by{" "}
                  <a
                    href={`https://unsplash.com/@goran_ivos?utm_source=nexusai&utm_medium=referral`}
                    target={`_blank`}
                    rel={`noreferrer`}
                    className={`underline underline-offset-4 hover:text-foreground`}
                  >
                    Goran Ivos on Unsplash
                  </a>
                </p>
              </motion.div>

              <motion.div {...animation} className={`order-1 flex flex-col gap-6`}>
                <SectionHeading
                  eyebrow={`A quick introduction`}
                  title={`About`}
                  description={`I’m a product-focused creator who enjoys simplifying complexity. I collaborate closely with stakeholders, iterate quickly, and ship with quality. My work blends aesthetics with usability and measurable outcomes.`}
                />

                <div className={`grid gap-3`}>
                  <div className={`flex items-start gap-3 rounded-xl border bg-card p-4`}>
                    <MapPinIcon className={`mt-0.5 size-4 text-muted-foreground`} />
                    <div className={`grid gap-1`}>
                      <p className={`text-sm font-medium`}>Location</p>
                      <p className={`text-sm text-muted-foreground`}>
                        Open to remote / on-site (set your city)
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 rounded-xl border bg-card p-4`}>
                    <ArrowRightIcon className={`mt-0.5 size-4 text-muted-foreground`} />
                    <div className={`grid gap-1`}>
                      <p className={`text-sm font-medium`}>Focus</p>
                      <p className={`text-sm text-muted-foreground`}>
                        Web apps, dashboards, landing pages, and design systems
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`flex flex-wrap gap-3`}>
                  <Button
                    variant={`outline`}
                    onClick={() =>
                      toast.message(`About section`, {
                        description: `Add a longer story, your values, and the kinds of problems you love to solve.`,
                      })
                    }
                  >
                    Read More
                  </Button>
                  <Button variant={`ghost`} onClick={() => scrollToId(`contact`)}>
                    Let’s talk <ArrowRightIcon />
                  </Button>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        <section id={`projects`} className={`scroll-mt-24`}>
          <Container className={`py-14 sm:py-18`}>
            <div className={`flex flex-col gap-8`}>
              <motion.div {...animation} className={`flex flex-col gap-5`}>
                <div className={`flex items-end justify-between gap-6`}>
                  <SectionHeading
                    eyebrow={`Selected work with impact`}
                    title={`Featured Projects`}
                    description={null}
                  />
                  <Button
                    variant={`outline`}
                    className={`hidden sm:inline-flex`}
                    onClick={() =>
                      toast.message(`All Projects`, {
                        description: `Add a dedicated /projects page later if you want.`,
                      })
                    }
                  >
                    All Projects
                  </Button>
                </div>

                <div className={`flex flex-wrap gap-2`}>
                  {tags.map((tag) => {
                    const active = tag === selectedTag;
                    return (
                      <Button
                        key={tag}
                        size={`sm`}
                        variant={active ? `default` : `outline`}
                        onClick={() => setSelectedTag(tag)}
                        aria-pressed={active}
                      >
                        {tag}
                      </Button>
                    );
                  })}
                </div>
              </motion.div>

              {filteredProjects.length === 0 ? (
                <div className={`rounded-2xl border bg-card p-8`}>
                  <p className={`font-medium`}>No projects found.</p>
                  <p className={`mt-1 text-sm text-muted-foreground`}>
                    Try selecting a different tag.
                  </p>
                </div>
              ) : (
                <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3`}>
                  {filteredProjects.map((p) => (
                    <motion.div key={p.id} {...animation}>
                      <Card className={`h-full`}>
                        <CardHeader>
                          <CardTitle className={`text-base`}>{p.title}</CardTitle>
                          <CardDescription>{p.description}</CardDescription>
                        </CardHeader>
                        <CardContent className={`flex flex-wrap gap-2`}>
                          {p.tags.slice(0, 4).map((t) => (
                            <Badge key={t} variant={`secondary`}>
                              {t}
                            </Badge>
                          ))}
                        </CardContent>
                        <CardFooter className={`justify-between gap-2`}>
                          <ProjectDialog
                            title={p.title}
                            description={p.description}
                            tags={p.tags}
                          />
                          <Button
                            size={`sm`}
                            variant={`ghost`}
                            onClick={() =>
                              toast.message(`Pin project`, {
                                description: `Add personalization here.`,
                              })
                            }
                          >
                            Pin
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Container>
        </section>

        <section id={`skills`} className={`scroll-mt-24`}>
          <Container className={`py-14 sm:py-18`}>
            <div className={`grid gap-8 lg:grid-cols-2`}>
              <motion.div {...animation}>
                <SectionHeading
                  eyebrow={`What I use to ship`}
                  title={`Skills`}
                  description={null}
                />
              </motion.div>
              <div className={`grid gap-4 sm:grid-cols-2`}>
                {skills.map((s) => (
                  <motion.div key={s.title} {...animation}>
                    <Card className={`h-full`}>
                      <CardHeader>
                        <CardTitle className={`text-base`}>{s.title}</CardTitle>
                        <CardDescription>{s.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section id={`experience`} className={`scroll-mt-24`}>
          <Container className={`py-14 sm:py-18`}>
            <div className={`flex flex-col gap-8`}>
              <motion.div {...animation}>
                <SectionHeading
                  eyebrow={`Roles & outcomes`}
                  title={`Experience`}
                  description={null}
                />
              </motion.div>

              <div className={`grid gap-3`}>
                {timeline.map((t, idx) => (
                  <motion.div key={t.title + idx} {...animation}>
                    <Card>
                      <CardHeader className={`gap-2`}>
                        <div className={`flex items-center justify-between gap-4`}>
                          <CardTitle className={`text-base`}>{t.title}</CardTitle>
                          <Badge variant={`outline`}>{t.period}</Badge>
                        </div>
                        <CardDescription>{t.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section id={`testimonials`} className={`scroll-mt-24`}>
          <Container className={`py-14 sm:py-18`}>
            <div className={`flex flex-col gap-8`}>
              <motion.div {...animation}>
                <SectionHeading
                  eyebrow={`What people say`}
                  title={`Testimonials`}
                  description={null}
                />
              </motion.div>

              <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3`}>
                {testimonials.map((t) => (
                  <motion.div key={t.name} {...animation}>
                    <Card className={`h-full`}>
                      <CardHeader>
                        <CardTitle className={`text-base`}>{t.name}</CardTitle>
                        <CardDescription>{t.role}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className={`text-sm leading-relaxed text-muted-foreground`}>
                          {t.quote}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section id={`contact`} className={`scroll-mt-24`}>
          <Container className={`py-14 sm:py-18`}>
            <div className={`grid gap-10 lg:grid-cols-2`}>
              <motion.div {...animation} className={`flex flex-col gap-6`}>
                <SectionHeading
                  eyebrow={`Tell me about your project`}
                  title={`Let’s work together`}
                  description={`Share a brief about what you’re building and your timeline. I’ll reply within 24–48 hours.`}
                />

                <div className={`grid gap-3`}>
                  <div className={`flex items-start gap-3 rounded-xl border bg-card p-4`}>
                    <MailIcon className={`mt-0.5 size-4 text-muted-foreground`} />
                    <div className={`grid gap-1`}>
                      <p className={`text-sm font-medium`}>Email</p>
                      <p className={`text-sm text-muted-foreground`}>
                        yourname@email.com
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 rounded-xl border bg-card p-4`}>
                    <LinkedinIcon className={`mt-0.5 size-4 text-muted-foreground`} />
                    <div className={`grid gap-1`}>
                      <p className={`text-sm font-medium`}>Social</p>
                      <p className={`text-sm text-muted-foreground`}>
                        LinkedIn • GitHub • Dribbble (replace with your links)
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`flex flex-wrap gap-3`}>
                  <Button onClick={onEmailMe}>
                    Email Me <MailIcon />
                  </Button>
                  <Button
                    variant={`outline`}
                    onClick={() =>
                      toast.message(`LinkedIn`, {
                        description: `Replace this with your real LinkedIn URL.`,
                      })
                    }
                  >
                    LinkedIn <ExternalLinkIcon />
                  </Button>
                  <Button
                    variant={`ghost`}
                    onClick={() =>
                      toast.message(`GitHub`, {
                        description: `Replace this with your real GitHub URL.`,
                      })
                    }
                  >
                    GitHub <GithubIcon />
                  </Button>
                </div>
              </motion.div>

              <motion.div {...animation}>
                <Card>
                  <CardHeader>
                    <CardTitle className={`text-base`}>Contact form</CardTitle>
                    <CardDescription>
                      Draft is saved locally in your browser.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className={`grid gap-4`} onSubmit={onSubmitContact}>
                      <div className={`grid gap-2`}>
                        <label className={`text-sm font-medium`} htmlFor={`name`}>
                          Name
                        </label>
                        <Input
                          id={`name`}
                          value={contactDraft.name}
                          onChange={(e) =>
                            setContactDraft({ ...contactDraft, name: e.target.value })
                          }
                          placeholder={`Your name`}
                          autoComplete={`name`}
                        />
                      </div>
                      <div className={`grid gap-2`}>
                        <label className={`text-sm font-medium`} htmlFor={`email`}>
                          Email
                        </label>
                        <Input
                          id={`email`}
                          value={contactDraft.email}
                          onChange={(e) =>
                            setContactDraft({ ...contactDraft, email: e.target.value })
                          }
                          placeholder={`you@company.com`}
                          autoComplete={`email`}
                        />
                      </div>
                      <div className={`grid gap-2`}>
                        <label className={`text-sm font-medium`} htmlFor={`message`}>
                          Message
                        </label>
                        <Textarea
                          id={`message`}
                          value={contactDraft.message}
                          onChange={(e) =>
                            setContactDraft({
                              ...contactDraft,
                              message: e.target.value,
                            })
                          }
                          placeholder={`What are you building? Timeline, scope, and goals…`}
                          className={`min-h-32`}
                        />
                      </div>
                      <div className={`flex flex-wrap gap-2`}>
                        <Button type={`submit`}>Send message</Button>
                        <Button
                          type={`button`}
                          variant={`outline`}
                          onClick={() => {
                            setContactDraft({ name: ``, email: ``, message: `` });
                            toast.message(`Draft cleared`);
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>
      </main>

      <footer className={`border-t`}>
        <Container className={`py-10`}>
          <div className={`flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between`}>
            <p className={`text-sm text-muted-foreground`}>
              © 2026 Abdul Sayyed. All rights reserved.
            </p>
            <div className={`flex flex-wrap items-center gap-2`}>
              <Button variant={`secondary`} onClick={() => scrollToId(`top`)}>
                Back to Top
              </Button>
              <Button variant={`outline`} onClick={() => scrollToId(`about`)} size={`sm`}>
                About
              </Button>
              <Button
                variant={`outline`}
                onClick={() => scrollToId(`projects`)}
                size={`sm`}
              >
                Projects
              </Button>
              <Button variant={`outline`} onClick={() => scrollToId(`skills`)} size={`sm`}>
                Skills
              </Button>
              <Button variant={`outline`} onClick={() => scrollToId(`contact`)} size={`sm`}>
                Contact
              </Button>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
