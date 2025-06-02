"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/ui/card";
import { Button } from "@shared/ui/components/ui/button";
import { Badge } from "@shared/ui/components/ui/badge";
import { Input } from "@shared/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shared/ui/components/ui/dialog";
import { Label } from "@shared/ui/components/ui/label";
import { Users, UserPlus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@shared/types";

// interface UserWithRole extends User {
//   role: "admin" | "staff"
//   status: "active" | "inactive"
//   lastLogin?: string
// }

export default function UserManagementPage() {
  //   const { user: currentUser } = useCurrentUser()
  //   const [users, setUsers] = useState<UserWithRole[]>([])
  //   const [loading, setLoading] = useState(true)
  //   const [searchTerm, setSearchTerm] = useState("")
  //   const [roleFilter, setRoleFilter] = useState<string>("all")
  //   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  //   // Mock data - replace with actual API calls
  //   useEffect(() => {
  //     // Simulate API call
  //     setTimeout(() => {
  //       setUsers([
  //         {
  //           id: "1",
  //           email: "admin@inventrack.com",
  //           username: "admin",
  //           role: "admin",
  //           status: "active",
  //           lastLogin: "2024-01-15T10:30:00Z",
  //         },
  //         {
  //           id: "2",
  //           email: "john.doe@company.com",
  //           username: "john.doe",
  //           role: "staff",
  //           status: "active",
  //           lastLogin: "2024-01-15T09:15:00Z",
  //         },
  //         {
  //           id: "3",
  //           email: "jane.smith@company.com",
  //           username: "jane.smith",
  //           role: "staff",
  //           status: "active",
  //           lastLogin: "2024-01-14T16:45:00Z",
  //         },
  //       ])
  //       setLoading(false)
  //     }, 1000)
  //   }, [])

  //   const filteredUsers = users.filter((user) => {
  //     const matchesSearch =
  //       user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       user.email.toLowerCase().includes(searchTerm.toLowerCase())
  //     const matchesRole = roleFilter === "all" || user.role === roleFilter
  //     return matchesSearch && matchesRole
  //   })

  //   const handleCreateUser = () => {
  //     toast.success("User creation functionality would be implemented here")
  //     setIsCreateModalOpen(false)
  //   }

  //   const handleEditUser = (userId: string) => {
  //     toast.info(`Edit user ${userId} functionality would be implemented here`)
  //   }

  //   const handleDeleteUser = (userId: string) => {
  //     toast.error(`Delete user ${userId} functionality would be implemented here`)
  //   }

  //   const getRoleBadgeColor = (role: string) => {
  //     return role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
  //   }

  //   const getStatusBadgeColor = (status: string) => {
  //     return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  //   }

  //   if (currentUser?.role !== "admin") {
  //     return (
  //       <div className="flex items-center justify-center min-h-screen">
  //         <Card className="w-96">
  //           <CardContent className="pt-6">
  //             <div className="text-center">
  //               <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
  //               <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
  //               <p className="text-muted-foreground">You don't have permission to access user management.</p>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     )
  //   }

  return (
    // <div className="space-y-6 p-6">
    //   <div className="flex justify-between items-center">
    //     <div>
    //       <h1 className="text-3xl font-bold">User Management</h1>
    //       <p className="text-muted-foreground">Manage system users and their roles</p>
    //     </div>
    //     <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
    //       <DialogTrigger asChild>
    //         <Button>
    //           <UserPlus className="h-4 w-4 mr-2" />
    //           Add User
    //         </Button>
    //       </DialogTrigger>
    //       <DialogContent>
    //         <DialogHeader>
    //           <DialogTitle>Create New User</DialogTitle>
    //         </DialogHeader>
    //         <div className="space-y-4">
    //           <div>
    //             <Label htmlFor="email">Email</Label>
    //             <Input id="email" type="email" placeholder="user@company.com" />
    //           </div>
    //           <div>
    //             <Label htmlFor="username">Username</Label>
    //             <Input id="username" placeholder="username" />
    //           </div>
    //           <div>
    //             <Label htmlFor="role">Role</Label>
    //             <Select>
    //               <SelectTrigger>
    //                 <SelectValue placeholder="Select role" />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="staff">Staff</SelectItem>
    //                 <SelectItem value="admin">Admin</SelectItem>
    //               </SelectContent>
    //             </Select>
    //           </div>
    //           <div>
    //             <Label htmlFor="password">Temporary Password</Label>
    //             <Input id="password" type="password" placeholder="••••••••" />
    //           </div>
    //           <Button onClick={handleCreateUser} className="w-full">
    //             Create User
    //           </Button>
    //         </div>
    //       </DialogContent>
    //     </Dialog>
    //   </div>
    //   {/* Stats Cards */}
    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium">Total Users</CardTitle>
    //         <Users className="h-4 w-4 text-muted-foreground" />
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold">{users.length}</div>
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
    //         <Users className="h-4 w-4 text-muted-foreground" />
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium">Staff Users</CardTitle>
    //         <Users className="h-4 w-4 text-muted-foreground" />
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold">{users.filter((u) => u.role === "staff").length}</div>
    //       </CardContent>
    //     </Card>
    //   </div>
    //   {/* Filters */}
    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Users</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <div className="flex gap-4 mb-6">
    //         <div className="relative flex-1">
    //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    //           <Input
    //             placeholder="Search users..."
    //             value={searchTerm}
    //             onChange={(e) => setSearchTerm(e.target.value)}
    //             className="pl-10"
    //           />
    //         </div>
    //         <Select value={roleFilter} onValueChange={setRoleFilter}>
    //           <SelectTrigger className="w-48">
    //             <SelectValue placeholder="Filter by role" />
    //           </SelectTrigger>
    //           <SelectContent>
    //             <SelectItem value="all">All Roles</SelectItem>
    //             <SelectItem value="admin">Admin</SelectItem>
    //             <SelectItem value="staff">Staff</SelectItem>
    //           </SelectContent>
    //         </Select>
    //       </div>
    //       {loading ? (
    //         <div className="text-center py-8">
    //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
    //         </div>
    //       ) : (
    //         <div className="space-y-4">
    //           {filteredUsers.map((user) => (
    //             <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
    //               <div className="flex items-center space-x-4">
    //                 <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
    //                   <span className="text-sm font-medium">{user.username.charAt(0).toUpperCase()}</span>
    //                 </div>
    //                 <div>
    //                   <div className="font-medium">{user.username}</div>
    //                   <div className="text-sm text-muted-foreground">{user.email}</div>
    //                   {user.lastLogin && (
    //                     <div className="text-xs text-muted-foreground">
    //                       Last login: {new Date(user.lastLogin).toLocaleDateString()}
    //                     </div>
    //                   )}
    //                 </div>
    //               </div>
    //               <div className="flex items-center space-x-4">
    //                 <Badge className={getRoleBadgeColor(user.role)}>{user.role.toUpperCase()}</Badge>
    //                 <Badge className={getStatusBadgeColor(user.status)}>{user.status.toUpperCase()}</Badge>
    //                 <div className="flex space-x-2">
    //                   <Button variant="ghost" size="sm" onClick={() => handleEditUser(user.id)}>
    //                     <Edit className="h-4 w-4" />
    //                   </Button>
    //                   <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
    //                     <Trash2 className="h-4 w-4" />
    //                   </Button>
    //                 </div>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       )}
    //     </CardContent>
    //   </Card>
    // </div>
    <></>
  );
}
