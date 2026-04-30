import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const KNOWN_HTML_FILES = [
  'index.html',
  'courses.html',
  'certifications.html',
  'contact.html',
  'crew-members.html',
  'tech-giants.html',
  'patners.html',
  'acivements.html',
  'colleges-collibration.html',
  'hackology-images.html',
  'nsd-events-images.html',
  'maharashtra-police-academ-images.html',
  '404.html'
];

const routeToPage = (pathname) => {
  if (pathname === '/' || pathname === '') return 'index.html';
  const clean = pathname.replace(/^\//, '');
  if (KNOWN_HTML_FILES.includes(clean)) return clean;
  return '404.html';
};

const patchInternalLinks = (container, navigate) => {
  const links = container.querySelectorAll('a[href]');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }
    if (href.endsWith('.html')) {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        navigate(`/${href}`);
      });
    }
  });
};

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const page = useMemo(() => routeToPage(location.pathname), [location.pathname]);
  const [content, setContent] = useState('<p style="padding:2rem">Loading...</p>');

  useEffect(() => {
    let active = true;
    fetch(`/${page}`)
      .then((res) => res.text())
      .then((html) => {
        if (!active) return;
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        parsed.querySelectorAll('script').forEach((s) => s.remove());
        setContent(parsed.body.innerHTML);
      })
      .catch(() => {
        setContent('<p style="padding:2rem">Page failed to load.</p>');
      });

    return () => {
      active = false;
    };
  }, [page]);

  useEffect(() => {
    const root = document.getElementById('legacy-content');
    if (!root) return;
    patchInternalLinks(root, navigate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [content, navigate]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div id="legacy-content" dangerouslySetInnerHTML={{ __html: content }} />
      </motion.div>
    </AnimatePresence>
  );
}
