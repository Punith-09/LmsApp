export default function CourseByIdPage() {
  return (
    <div>
      {/* your content */} 
    </div>
  );
}

/* =======================================
   FIX FOR VERCEL BUILD
   DISABLE SSG → FORCE SSR
======================================= */
export const getServerSideProps = async () => {
  return { props: {} };
};
