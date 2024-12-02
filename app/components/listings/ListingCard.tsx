'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeUser } from "@/app/types";

import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
  data: SafeListing; 
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  // Assuming 'data.locationValue' contains location info to fetch detailed location
  const location = getByValue(data.locationValue);

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disabled) return;
    onAction?.(actionId);
  };

  const price = useMemo(() => {
    return data.price;
  }, [data.price]);

  // Format price for better display
  const formattedPrice = price.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover h-full w-full group-hover:scale-110 transition"
            src={data.imageSrc}
            alt="Listing"
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>

        <div className="font-semibold text-lg">{data.title}</div>

        {/* Display Location Information */}
        {location && (
          <div className="font-light text-neutral-500">
            {location?.region}, {location?.label}
          </div>
        )}

        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">{formattedPrice}</div>
          <div className="font-light">per day</div>
        </div>

        {/* Action button, only shown when actionLabel exists */}
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
