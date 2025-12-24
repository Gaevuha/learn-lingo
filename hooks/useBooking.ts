import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { createBooking } from "@/lib/firebase";
import { BookingData } from "@/types/teacher";

export const useBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const bookingMutation = useMutation({
    mutationFn: (bookingData: BookingData) => {
      if (!user) {
        throw new Error("User is not authorized");
      }
      return createBooking(user.uid, bookingData);
    },
    onSuccess: () => {
      // Invalidate cache after successful booking
      queryClient.invalidateQueries({ queryKey: ["bookings", user?.uid] });
    },
  });

  const bookTrialLesson = async (bookingData: BookingData) => {
    try {
      await bookingMutation.mutateAsync(bookingData);
      return {
        success: true,
        message: "Lesson successfully booked!",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Booking error",
      };
    }
  };

  return {
    bookTrialLesson,
    isLoading: bookingMutation.isPending,
    error: bookingMutation.error,
  };
};
