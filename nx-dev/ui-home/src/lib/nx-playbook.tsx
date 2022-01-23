import React, { ReactComponentElement, useEffect } from 'react';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function NxPlaybook(): ReactComponentElement<any> {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    controls.start('visible');
  }, [controls, inView]);

  return (
    <article
      id="nx-playbook"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              ease: 'linear',
              duration: 0.24,
              type: 'tween',
            },
          },
        }}
        className="bg-blue-nx-base rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4"
      >
        <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
          <div className="lg:self-center relative">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Premium courses</span>
              <span className="block">to know everything</span>
            </h1>
            <p className="mt-4 text-lg leading-6 text-gray-100">
              We recorded a complete set of courses to make sure you will be
              proficient as fast as possible. They cover all the Nx features to
              take control of your workspace.
            </p>
            <Link href="https://nxplaybook.com/?utm_source=nx.dev">
              <a
                title="Dedicated carefully created Nx courses to get you up and running in no time"
                rel="nofollow"
                target="_blank"
                className="mt-8 bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-blue-nx-base hover:bg-gray-100"
              >
                Check the courses on NxPlaybook
              </a>
            </Link>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1"
        >
          <img
            loading="lazy"
            className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
            src="/images/nx-playbook.webp"
            alt="nx courses on nxplaybook.com"
          />
        </div>
      </motion.div>
    </article>
  );
}

export default NxPlaybook;
