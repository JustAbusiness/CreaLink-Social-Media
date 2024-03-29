'use client';
import React, { useEffect, useState } from 'react';
import { HomeOutlined, SearchOutlined, HeartOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

function Navbar() {
  const { data: session } = useSession();
  const antIcons = [HomeOutlined, SearchOutlined, HeartOutlined, BellOutlined, UserOutlined];
  const hrefs = ['/home', '/search', '/favorites', '/notifications', '/profile'];

  // const hasNotifications = session?.user?.hasNotification;
  const [hasNotifications, setHasNotifications] = useState(false);
  console.log('HAS NOTIFICATION: ', hasNotifications);
  const fetchNotifications = async () => {
    if (!session) {
      return;
    }

    const token = session?.user?.accessToken;

    try {
      const response = await fetch(`https://crealink.khangtgr.com/api/user/get-user-notification`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      });

      if (!response.ok) {
        console.error('Error fetching notifications. Server response:', response);
        return;
      }

      const responseData = await response.json();
      const fetchNotifi = responseData.data.notifications;
      setHasNotifications(fetchNotifi.length > 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const pollingInterval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(pollingInterval);
  }, [session]);

  return (
    <div className="w-[600px] ml-[13%] flex justify-center space-x-20">
      {antIcons.map((AntIcon, index) => (
        <Link key={index} href={hrefs[index]} passHref>
          <div className="flex flex-col items-center cursor-pointer">
            <AntIcon style={{ fontSize: '30px', color:'#A20103' }} />
            {index === 3 && hasNotifications && (
              <span className="relative flex h-3 w-3 bottom-9 left-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-700 opacity-75"></span>
                <span className="absolute inline-flex rounded-full h-3 w-3 bg-red-800"></span>
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Navbar;
