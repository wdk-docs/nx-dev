import React from 'react';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import {
  Footer,
  Header,
  NpxCreateNxWorkspace,
  NxUsersShowcase,
} from '@nrwl/nx-dev/ui-common';
import {
  AffectedCommand,
  CloudSupport,
  DependencyGraph,
  EcosystemFeatures,
  EggheadCourses,
  ExperienceFeatures,
  GettingStarted,
  MonorepoFeatures,
  NxPlaybook,
  OpenPlatform,
  OpenSourceProjects,
  Performance,
  VscodePlugin,
  YoutubeChannel,
} from '@nrwl/nx-dev/ui-home';

export function Index() {
  return (
    <>
      <NextSeo
        title="Nx: Smart, Fast and Extensible Build System"
        description="Next generation build system with first class monorepo support and powerful integrations."
        openGraph={{
          url: 'https://nx.dev',
          title: 'Nx: Smart, Fast and Extensible Build System',
          description:
            'Nx is a smart, fast and extensible build system which comes with first class monorepo support and powerful integrations.',
          images: [
            {
              url: 'https://nx.dev/images/nx-media.jpg',
              width: 800,
              height: 400,
              alt: 'Nx: Smart, Fast and Extensible Build System',
              type: 'image/jpeg',
            },
          ],
          site_name: 'Nx',
          type: 'website',
        }}
      />
      <h1 className="sr-only">Next generation monorepo tool</h1>
      <Header showSearch={true} useDarkBackground={false} />
      <main role="main">
        <div className="w-full">
          {/*INTRO COMPONENT*/}
          <header
            id="animated-background"
            className="bg-blue-nx-base text-white transform-gpu lg:bg-contain bg-clip-border bg-origin-border bg-right bg-no-repeat"
            style={{
              backgroundImage: 'url(/images/background/hero-bg-large.svg)',
            }}
          >
            <div className="max-w-screen-lg xl:max-w-screen-xl mx-auto px-4 py-4 md:py-18">
              <div className="my-8 md:my-18 2xl:my-24 flex  flex-col items-center justify-center">
                <div className="w-full text-center flex flex-col">
                  <h1 className="text-4xl sm:text-5xl lg:text-5xl leading-none font-extrabold tracking-tight sm:mt-10 mb-8 sm:mt-14 sm:mb-10">
                    <span className="block lg:inline">智能、快速和可扩展</span>{' '}
                    构建系统
                  </h1>
                  <h2 className="max-w-2xl mx-auto text-2xl font-semibold mb-10 sm:mb-11">
                    具有一流的 Monorepo 支持和强大的集成的下一代构建系统。
                  </h2>
                </div>
                <div
                  aria-hidden="true"
                  className="max-w-2xl mx-auto hidden sm:flex w-full flex-col justify-between items-center lg:pb-0 pb-10 mt-8 lg:mt-0"
                >
                  <NpxCreateNxWorkspace />
                </div>
                <div className="my-14 flex flex-wrap sm:space-x-4 text-center">
                  <Link href="#getting-started">
                    <a
                      title="Start using Nx by creating a workspace"
                      className="w-full sm:w-auto flex-none bg-white text-blue-nx-base hover:text-blue-nx-dark hover:bg-gray-100 text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition"
                    >
                      创建Nx工作区
                    </a>
                  </Link>

                  <Link href="/migration/adding-to-monorepo">
                    <a
                      title="Add Nx to existing Monorepo"
                      className="mt-4 md:mt-0 w-full sm:w-auto flex-none bg-white text-blue-nx-base hover:text-blue-nx-dark hover:bg-gray-100 text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition"
                    >
                      将Nx添加到Monorepo
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <div className="hidden md:block bg-gray-50 border-b border-gray-100">
            {/*COMPANIES*/}
            <NxUsersShowcase />
          </div>

          {/*NX FEATURES*/}
          <div
            id="features"
            className="relative bg-gray-50 py-12 overflow-hidden"
          >
            {/*MONOREPO*/}
            <MonorepoFeatures />
            <div className="relative my-12" aria-hidden="true">
              <div className="w-full border-t border-gray-100" />
            </div>

            {/*INTEGRATED*/}
            <ExperienceFeatures />
            <div className="relative my-12" aria-hidden="true">
              <div className="w-full border-t border-gray-100" />
            </div>
            {/*ECOSYSTEM*/}
            <EcosystemFeatures />
          </div>

          <div className="bg-gray-50 relative transform-gpu">
            <img
              className="w-full"
              src="/images/background/hero-bg-large-3.svg"
              loading="lazy"
              alt="separator"
              aria-hidden="true"
            />
          </div>

          {/*NX FEATURE DETAILS*/}
          <article
            id="features-in-depth"
            className="relative bg-gray-50 pb-32 overflow-hidden"
          >
            <header className="max-w-prose mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-base font-semibold text-blue-nx-base tracking-wide uppercase">
                  Monorepo 做得正确
                </h1>
                <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                  为任何规模的项目工作
                </p>
                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                  无论您有一个项目还是一千个项目，Nx都将使您的CI保持快速和可维护性。
                </p>
              </div>
            </header>
            {/*NX AFFECTED*/}
            <AffectedCommand />
            {/*DEP-GRAPH*/}
            <DependencyGraph />
            {/*NX CONSOLE*/}
            <VscodePlugin />
            {/*NEXT GENERATION CLOUD SUPPORT*/}
            <CloudSupport />
            {/*PERFORMANCE*/}
            <Performance />
            {/*OPEN PLATFORM*/}
            <OpenPlatform />
          </article>

          {/*GETTING STARTED*/}
          <article
            id="getting-started"
            className="relative bg-white pt-16 sm:pt-24 lg:pt-32"
          >
            <header className="mx-auto max-w-prose px-4 text-center sm:px-6 sm:max-w-3xl lg:px-8">
              <div>
                <h1 className="text-base font-semibold tracking-wider text-blue-nx-base uppercase">
                  开始使用 <span className="sr-only"> Nx</span>
                </h1>
                <p className="mt-2 text-4xl font-extrabold text-gray-800 tracking-tight sm:text-6xl">
                  TypeScript、React、Angular、Node等等
                </p>
                <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
                  Nx对许多前端和后端技术具有一流的支持，因此它的文档有多种风格。
                </p>
              </div>
            </header>

            <GettingStarted />
          </article>

          <div
            id="learning-materials"
            className="mt-28 max-w-prose mx-auto py-16 px-4 sm:py-18 sm:px-6 lg:px-8"
          >
            <div className="text-center">
              <p className="mt-1 text-4xl font-extrabold text-gray-800 sm:text-5xl sm:tracking-tight lg:text-6xl">
                免费课程和视频
              </p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                对于视觉学习者，我们创建了高质量的课程，通过构建真实世界的例子一步一步地走你。
              </p>
            </div>
          </div>

          {/*TUTORIALS*/}
          <div className="bg-white py-12">
            <EggheadCourses />
          </div>
          <div className="bg-white py-12">
            <YoutubeChannel />
          </div>
          <div className="bg-white py-12">
            <NxPlaybook />
          </div>

          <div className="bg-white relative transform-gpu">
            <img
              className="w-full"
              loading="lazy"
              src="/images/background/hero-bg-large-2.svg"
              alt="separator"
              aria-hidden="true"
            />
          </div>

          {/*COMMUNITY*/}
          <article id="community" className="bg-white">
            <div className="max-w-prose mx-auto py-16 px-4 sm:py-18 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-base font-semibold text-gray-600 tracking-wide uppercase">
                  社区
                </h1>
                <p className="mt-1 text-4xl font-extrabold text-gray-800 sm:text-5xl sm:tracking-tight lg:text-6xl">
                  被流行的开源项目使用
                </p>
                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                  Nx同样适用于开发应用程序的团队，以及开发开源库和工具的社区。
                </p>
              </div>
            </div>

            {/*OPEN SOURCE PROJECTS*/}
            <OpenSourceProjects />

            {/*/!*TESTIMONIALS*!/*/}
            {/*<div*/}
            {/*  id="testimonials"*/}
            {/*  className="mt-28 max-w-prose mx-auto py-16 px-4 sm:py-18 sm:px-6 lg:px-8"*/}
            {/*>*/}
            {/*  <div className="text-center">*/}
            {/*    <p className="mt-1 text-4xl font-extrabold text-gray-800 sm:text-5xl sm:tracking-tight lg:text-6xl">*/}
            {/*      What Devs Love About Nx*/}
            {/*    </p>*/}
            {/*    <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">*/}
            {/*      More than 600k developers all over the world build and ship*/}
            {/*      with Nx. This is what they love about it.*/}
            {/*    </p>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*/!*TESTIMONIALS*!/*/}
            {/*<Testimonials />*/}
            {/*COMPANIES*/}
            <div className="my-12">
              <NxUsersShowcase />
            </div>
          </article>
        </div>
      </main>
      <Footer useDarkBackground={false} />
    </>
  );
}

export default Index;
