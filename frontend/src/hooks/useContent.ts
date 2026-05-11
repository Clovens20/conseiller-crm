import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useContent(pageSlug: string, sectionId: string = 'main', defaultContent: any = {}) {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('page_slug', pageSlug)
          .eq('section_id', sectionId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching site content:', error);
          setContent(defaultContent);
        } else if (data) {
          // Merge defaults with saved content to ensure no missing keys
          setContent({ ...defaultContent, ...data.content });
        } else {
          // No record found, use defaults
          setContent(defaultContent);
        }
      } catch (err) {
        console.error('Unexpected error fetching site content:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [pageSlug, sectionId]);

  return { content, loading };
}
