'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";


import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  SignalIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  TvIcon,
  FingerPrintIcon,
  BanknotesIcon,
  CogIcon,
  MagnifyingGlassCircleIcon
} from '@heroicons/react/24/outline'
import { ArrowUpTrayIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'




function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar({ user }: { user: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'หน้าหลัก', href: '/', icon: HomeIcon},
    { name: 'ชุมชน', href: '/community', icon: UsersIcon},
    { name: 'วิดีโอ', href: '/video', icon: TvIcon},
    { name: 'สตรีมสด', href: '/live', icon: SignalIcon},
  ]
  
  let userNavigation = [
      { name: 'แดชบอร์ด', href: '/dashboard' },
      { name: 'โปรไฟล์ของคุณ', href: `/profiles/${user?.id}` },
      { name: 'ประวัติการซื้อวิดีโอ', href: '/history' },
      { name: 'แก้ไขโปรไฟล์', href: '/editprofile' },
    ]

  if (user && user.email == 'admin2@admin.com') {
    userNavigation.push({
      name: 'แอดมิน', href: '/admin'
    })
  }

  const dashboardNavigation = [
    { name: "แดชบอร์ด", href: "/dashboard", icon: HomeIcon },
    { name: "วิดีโอของฉัน", href: "/dashboard/video", icon: TvIcon },
    { name: "โพสต์ของฉัน", href: "/dashboard/posts", icon: UsersIcon },
    { name: "รายได้ของฉัน", href: "/dashboard/profit", icon: BanknotesIcon },
  ];

  const adminNavigation = [
    { name: "แผงควบคุม", href: "/admin", icon: HomeIcon },
    { name: "จัดการผู้ใช้", href: "/admin/users", icon: UsersIcon },
    { name: "จัดการวิดีโอ", href: "/admin/videos", icon: TvIcon },
    { name: "จัดการรายงาน", href: "/admin/report", icon: CogIcon },
  ];

  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  const Mapnavigation = isAdmin ? adminNavigation : isDashboard ? dashboardNavigation : navigation;
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 

    if (query.trim() === "") return; 

    router.push(`/search?query=${encodeURIComponent(query)}`); 
  };
  

  return (
    <>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <Link href="/" className="flex h-16 shrink-0 items-center">
                  <Image
                    src="/images/logo.png" className="h-8 w-auto"
                    width={1028} height={1013}
                    alt="Chieckeam Logo"
                    />
                </Link>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                      {Mapnavigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                isActive
                                  ? 'bg-gray-50 text-red-600'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-red-600',
                                'group flex gap-x-3 rounded-md p-2 text-md font-semibold',
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-red-600',
                                  'size-6 shrink-0',
                                )}
                              />
                              {item.name}
                            </a>
                          </li>
                        );
                      })}
                      </ul>
                    </li>
                 
                    <li className="mt-auto">
                      <a
                        href="#"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-600"
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          className="size-6 shrink-0 text-gray-400 group-hover:text-red-600"
                        />
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <Link href="/" className="flex h-16 shrink-0 items-center">
            <Image
                src="/images/logo.png" className="h-12 w-auto"
                width={1028} height={1013}
                alt="Chieckeam Logo"
            />
            </Link>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-5 mt-6">
                    {Mapnavigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            isActive
                              ? 'border border-red-400 bg-gray-50 text-red-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-red-600',
                            'group flex items-center gap-x-[-4px] rounded-xl p-2 text-xl font-semibold',
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-red-600',
                              'size-8 shrink-0 ml-2',
                            )}
                          />
                          <span className='mt-1 mx-auto text-center'>{item.name}</span>
                        </a>
                      </li>
                    );
                  })}
                  </ul>
                </li>
                <li className="mt-auto">
                  <a
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  >
                    <Cog6ToothIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-red-600"
                    />
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6 mx-auto" />
            </button>

            {/* Separator */}
            <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form onSubmit={handleSubmit} className="grid flex-1 grid-cols-1">
                
                <label htmlFor="searchvideo" className="relative lg:w-1/2 w-full mx-auto text-gray-400 focus-within:text-gray-600 block">

                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="mx-auto pointer-events-none w-5 absolute top-7 transform -translate-y-1/2 left-2"/>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ค้นหาวิดีโอ"
                  aria-label="ค้นหาวิดีโอ"
                  className="w-full rounded-full h-10 mt-2 focus:outline-none block bg-gray-200 pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
                />
                <button type="submit" className='absolute right-0 top-3 cursor-pointer bg-white rounded-r-full px-2 border-r border-gray-300'>
                  <MagnifyingGlassCircleIcon className='size-8 text-gray-500' />
                </button>

                </label>
                    
                
              </form>
              {!user && (
                
                <>
                
                <div className="flex items-center gap-x-4 lg:gap-x-6">

                    <Link href='/login' className='bg-red-600 hover:bg-red-800 text-white p-2 rounded-xl font-bold inline-flex'>
                    
                    <FingerPrintIcon className="w-6 mr-2" />
                    
                    เข้าสู่ระบบ</Link>

                </div>
                
                </>

              )}
              {user && (
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <Link href="/selectup" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <ArrowUpTrayIcon aria-hidden="true" className="size-6" />
                </Link>

                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>

                <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
                
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={user?.image ? user.image : "/images/default.png"}
                      className="size-8 rounded-full bg-gray-50"
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span aria-hidden="true" className="ml-4 text-sm/6 font-semibold text-gray-900">
                        {user.name}
                      </span>
                      <ChevronDownIcon aria-hidden="true" className="ml-2 size-5 text-gray-400" />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 ring-1 shadow-lg ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <Link
                          href={item.href}
                          className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                        >
                          {item.name}
                        </Link>
                      </MenuItem>
                    ))}
                     <form action="/api/logout" method="POST" className='flex'>
                        <button className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden">ออกจากระบบ</button>
                    </form>
                  </MenuItems>
                </Menu>
              </div>
              )}
            </div>
          </div>
        </div>
    </>
  )
}
