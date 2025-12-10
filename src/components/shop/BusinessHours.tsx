import { Clock } from 'lucide-react';
import { useState } from 'react';

interface BusinessHoursProps {
  isEditing: boolean;
}

export function BusinessHours({ isEditing }: BusinessHoursProps) {
  const [hours, setHours] = useState([
    { day: 'Monday', open: '08:00', close: '20:00', isOpen: true },
    { day: 'Tuesday', open: '08:00', close: '20:00', isOpen: true },
    { day: 'Wednesday', open: '08:00', close: '20:00', isOpen: true },
    { day: 'Thursday', open: '08:00', close: '20:00', isOpen: true },
    { day: 'Friday', open: '08:00', close: '20:00', isOpen: true },
    { day: 'Saturday', open: '09:00', close: '22:00', isOpen: true },
    { day: 'Sunday', open: '10:00', close: '18:00', isOpen: true },
  ]);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-primary">Business Hours</h3>
      </div>

      <div className="space-y-3">
        {hours.map((schedule, index) => (
          <div key={schedule.day} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
            <div className="w-28">
              <p className="text-sm text-primary">{schedule.day}</p>
            </div>

            {isEditing ? (
              <>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={schedule.isOpen}
                    onChange={(e) => {
                      const newHours = [...hours];
                      newHours[index].isOpen = e.target.checked;
                      setHours(newHours);
                    }}
                    className="w-4 h-4 text-accent rounded focus:ring-accent"
                  />
                  <span className="text-sm text-gray-600">Open</span>
                </label>

                {schedule.isOpen && (
                  <>
                    <input
                      type="time"
                      value={schedule.open}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[index].open = e.target.value;
                        setHours(newHours);
                      }}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="time"
                      value={schedule.close}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[index].close = e.target.value;
                        setHours(newHours);
                      }}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </>
                )}
              </>
            ) : (
              <div className="flex-1">
                {schedule.isOpen ? (
                  <p className="text-sm text-gray-600">
                    {schedule.open} - {schedule.close}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">Closed</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
