import { useRouter } from 'next/router';
import { SiViaplay, SiGoogledataproc, SiOpenaigym } from "react-icons/si";
import { TbDeviceDesktopAnalytics, TbBrandOpenai } from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import { MdAppShortcut } from "react-icons/md";
import { FaHackerrank } from "react-icons/fa";
import { BsClipboardDataFill } from "react-icons/bs";
import styles from '../styles/explore.module.scss';
import { useStoreState } from 'easy-peasy';
const courses = [
  { name: 'Web Development', icon: TbDeviceDesktopAnalytics, bg: 'bgPink' },
  { name: 'UI UX Designing', icon: LiaUikit, bg: 'bgGreen' },
  { name: 'App Development', icon: MdAppShortcut, bg: 'bgRed' },
  { name: 'Ethical Hacking', icon: FaHackerrank, bg: 'bgPink' },
  { name: 'AI/ML', icon: TbBrandOpenai, bg: 'bgGreen' },
  { name: 'Data Science', icon: SiGoogledataproc, bg: 'bgRed' },
  { name: 'Data Analytics', icon: BsClipboardDataFill, bg: 'bgPink' },
  { name: 'AI Tools', icon: SiOpenaigym, bg: 'bgGreen' },
];
const ExploreCourses: React.FC = () => {
  const user= useStoreState((state: any)=>state.auth.user);
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <span className={styles.title}>Explore</span>
        <span className={styles.title}>Our Courses</span>
        <p className={styles.desc}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem vel iure explicabo laboriosam accusantium expedita laudantium facere magnam.
        </p>
        <button className={styles.exploreBtn} onClick={() =>{user?router.push('/user/courses'):router.push('/login')} }>
          Explore Courses <SiViaplay className='w-[30px] h-[30px]' />
        </button>
      </div>
      <div className={styles.right}>
        {courses.map((course, idx) => {
          const Icon = course.icon;
          return (
            <div key={idx} className={styles.courseCard}>
              <div className={`${styles.iconWrapper} ${styles[course.bg]}`}>
                <Icon className={styles.icons} />
              </div>
              {course.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ExploreCourses;