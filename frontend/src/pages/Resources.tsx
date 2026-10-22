import PageLayout from "@/components/PageLayout";
import ResourceLibrary from "@/components/ResourceLibrary";
import SEO from "@/components/SEO";

const Resources = () => (
  <PageLayout>
    <SEO
      title="Startup Resources — StartupA2Z.org"
      description="Search founder insights, event notes, playbooks, and case studies from StartupA2Z.org."
      canonical="https://startupa2z.org/resources"
      ogImage="https://startupa2z.org/assets/og-resources.jpg"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "StartupA2Z.org Resources",
        url: "https://startupa2z.org/resources",
        description: "A searchable library of founder insights, event notes, playbooks, and case studies.",
      }}
    />
    <ResourceLibrary />
  </PageLayout>
);

export default Resources;
