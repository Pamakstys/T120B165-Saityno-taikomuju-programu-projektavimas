import React, { useEffect, useState } from "react";
import { getCurrentUser, changePassword } from "../pages/authentication/services";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "publisher";
};

interface UserSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ open, onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getCurrentUser()
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
      // Reset password fields when modal opens
      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
      setPasswordError(null);
      setPasswordSuccess(null);
      setPasswordLoading(false);
    }
  }, [open]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !repeatPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword !== repeatPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">User Settings</h2>
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : user ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Role</label>
                <input
                  type="text"
                  value={user.role}
                  disabled
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
            </div>
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-3 mt-4">
              <h3 className="text-lg font-semibold text-white mb-2">Change Password</h3>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
                autoComplete="current-password"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
                autoComplete="new-password"
              />
              <input
                type="password"
                placeholder="Repeat New Password"
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
                autoComplete="new-password"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition mt-2"
                disabled={passwordLoading}
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>
              {passwordError && <div className="text-red-400">{passwordError}</div>}
              {passwordSuccess && <div className="text-green-400">{passwordSuccess}</div>}
            </form>
          </div>
        ) : (
          <div className="text-red-400">Failed to load user data.</div>
        )}
      </div>
    </div>
  );
};

export default UserSettingsModal;