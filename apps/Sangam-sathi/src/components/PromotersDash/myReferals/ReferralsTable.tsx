import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  Tooltip,
  Stack,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
  HourglassEmpty as HourglassIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetMyUsers, useActivateFreeUser } from '../../api/Promoter';
import TokenService from '../../token/tokenService';

interface ReferralsTableProps {
  statusFilter?: string;
  initialTab?: string;
}

const ReferralsTable: React.FC<ReferralsTableProps> = ({ statusFilter, initialTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');

  // Map legacy filter strings or URL params to tab keys
  const getStartingTab = () => {
    if (urlTab) return urlTab.toLowerCase();
    if (initialTab) return initialTab.toLowerCase();
    if (statusFilter) {
      const s = statusFilter.toLowerCase();
      if (s === 'pending') return 'pending';
      if (s === 'success') return 'active';
      if (s === 'expired') return 'expired';
      if (s === 'inactive') return 'inactive';
      return 'all';
    }
    return 'all';
  };

  const [activeTab, setActiveTab] = useState<string>(getStartingTab);
  const [subFilter, setSubFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Activation dialog state
  const [selectedUserToActivate, setSelectedUserToActivate] = useState<any>(null);
  const [activateDialogOpen, setActivateDialogOpen] = useState<boolean>(false);

  // Sync tab with URL if changed externally
  useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab.toLowerCase());
    }
  }, [urlTab]);

  const decodedToken = TokenService.decodeToken();
  const promoterId = decodedToken?.promoter_id || decodedToken?.username;

  const { data, isLoading, error, refetch } = useGetMyUsers(promoterId);
  const activateUserMutation = useActivateFreeUser();

  // Check if current project allows promoter activation (Sangam-Sathi and Girija-Kalyana only)
  const projectName = (import.meta.env.VITE_PROJECT_NAME || '').toLowerCase();
  const isActivationAllowed = !projectName.includes('shree');

  const users: any[] = data?.users || [];

  // Helper checks
  const isPaidUser = (user: any) => {
    const role = (user?.user_role || user?.type_of_user || '').toLowerCase().trim();
    return role === 'silveruser' || role === 'premiumuser' || role === 'golduser' || (role !== 'freeuser' && role !== 'free' && role !== '');
  };

  const isFreeUser = (user: any) => {
    const role = (user?.user_role || user?.type_of_user || '').toLowerCase().trim();
    return role === 'freeuser' || role === 'free' || !role;
  };

  const isUserPending = (user: any) => {
    const status = (user?.status || '').toLowerCase().trim();
    return status === 'pending' || status === 'approval pending' || status === 'approval_pending';
  };

  const isUserActive = (user: any) => {
    const status = (user?.status || '').toLowerCase().trim();
    return status === 'active';
  };

  const isUserExpired = (user: any) => {
    const status = (user?.status || '').toLowerCase().trim();
    return status === 'expired';
  };

  const isUserInactive = (user: any) => {
    const status = (user?.status || '').toLowerCase().trim();
    return status === 'inactive';
  };

  // Tab counts
  const counts = useMemo(() => {
    const total = users.length;
    const pending = users.filter(isUserPending).length;
    const active = users.filter(isUserActive).length;
    const expired = users.filter(isUserExpired).length;
    const inactive = users.filter(isUserInactive).length;

    // Sub-counts for all
    const totalFree = users.filter(isFreeUser).length;
    const totalPaid = users.filter(isPaidUser).length;

    // Sub-counts for pending
    const pendingUsers = users.filter(isUserPending);
    const pendingFree = pendingUsers.filter(isFreeUser).length;
    const pendingPaid = pendingUsers.filter(isPaidUser).length;

    // Sub-counts for active
    const activeUsers = users.filter(isUserActive);
    const activeFree = activeUsers.filter(isFreeUser).length;
    const activePaid = activeUsers.filter(isPaidUser).length;

    return {
      total,
      pending,
      active,
      expired,
      inactive,
      totalFree,
      totalPaid,
      pendingFree,
      pendingPaid,
      activeFree,
      activePaid
    };
  }, [users]);

  const handleTabChange = (_event: React.SyntheticEvent, newTab: string) => {
    setActiveTab(newTab);
    setSubFilter('all');
    setSearchParams({ tab: newTab });
  };

  // Filter pipeline
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // 1. Tab filtering
      if (activeTab === 'pending' && !isUserPending(user)) return false;
      if (activeTab === 'active' && !isUserActive(user)) return false;
      if (activeTab === 'expired' && !isUserExpired(user)) return false;
      if (activeTab === 'inactive' && !isUserInactive(user)) return false;

      // 2. Sub-filter (for All, Pending or Active tabs)
      if (activeTab === 'all' || activeTab === 'pending' || activeTab === 'active') {
        if (subFilter === 'free' && !isFreeUser(user)) return false;
        if (subFilter === 'paid' && !isPaidUser(user)) return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const regNo = (user.registration_no || '').toLowerCase();
        const firstName = (user.first_name || '').toLowerCase();
        const lastName = (user.last_name || '').toLowerCase();
        const fullName = `${firstName} ${lastName}`.trim();
        const mobile = (user.mobile_no || '').toLowerCase();
        const email = (user.email_id || '').toLowerCase();
        const city = (user.city || '').toLowerCase();
        const caste = (user.caste || '').toLowerCase();

        return (
          regNo.includes(q) ||
          fullName.includes(q) ||
          mobile.includes(q) ||
          email.includes(q) ||
          city.includes(q) ||
          caste.includes(q)
        );
      }

      return true;
    });
  }, [users, activeTab, subFilter, searchQuery]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(`Copied: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenActivate = (user: any) => {
    setSelectedUserToActivate(user);
    setActivateDialogOpen(true);
  };

  const handleConfirmActivate = () => {
    if (!selectedUserToActivate?.registration_no) return;
    activateUserMutation.mutate(selectedUserToActivate.registration_no, {
      onSuccess: (res: any) => {
        toast.success(res?.message || 'Free user activated successfully!');
        setActivateDialogOpen(false);
        setSelectedUserToActivate(null);
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err?.message || 'Failed to activate user');
      }
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 8 }}>
        <CircularProgress sx={{ color: '#4a148c' }} />
        <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
          Loading your referrals...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load referral users. Please check your connection or log in again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5 } }}>
      {/* Header section */}
      <Box sx={{ mb: 2.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            My Referrals
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.25 }}>
            Total {counts.total} members registered using your referral code
          </Typography>
        </Box>

        {/* Search input */}
        <TextField
          size="small"
          placeholder="Search name, reg no, phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: { xs: '100%', sm: 280 },
            backgroundColor: '#ffffff',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: '0.875rem',
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>

      {/* Main Tabs Container */}
      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', mb: 2 }}>
        <Box sx={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#fafafa', px: 1 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 46,
              '& .MuiTab-root': {
                minHeight: 46,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#64748b',
                '&.Mui-selected': {
                  color: '#4a148c',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#4a148c',
                height: 3,
              },
            }}
          >
            <Tab value="all" label={`All Users (${counts.total})`} />
            <Tab value="pending" label={`Approval Pending (${counts.pending})`} />
            <Tab value="active" label={`Active Users (${counts.active})`} />
            <Tab value="expired" label={`Expired (${counts.expired})`} />
            <Tab value="inactive" label={`Inactive (${counts.inactive})`} />
          </Tabs>
        </Box>

        {/* Sub-filter row for All, Pending and Active tabs */}
        {(activeTab === 'all' || activeTab === 'pending' || activeTab === 'active') && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
              px: 2,
              py: 1.25,
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, mr: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Filter By Plan:
            </Typography>

            <Chip
              label={`All (${activeTab === 'all' ? counts.total : activeTab === 'pending' ? counts.pending : counts.active})`}
              size="small"
              clickable
              onClick={() => setSubFilter('all')}
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                backgroundColor: subFilter === 'all' ? '#4a148c' : '#f1f5f9',
                color: subFilter === 'all' ? '#ffffff' : '#475569',
                '&:hover': {
                  backgroundColor: subFilter === 'all' ? '#3b0f70' : '#e2e8f0',
                },
              }}
            />

            <Chip
              label={`Free Users (${activeTab === 'all' ? counts.totalFree : activeTab === 'pending' ? counts.pendingFree : counts.activeFree})`}
              size="small"
              clickable
              onClick={() => setSubFilter('free')}
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                backgroundColor: subFilter === 'free' ? '#0284c7' : '#f1f5f9',
                color: subFilter === 'free' ? '#ffffff' : '#475569',
                '&:hover': {
                  backgroundColor: subFilter === 'free' ? '#0369a1' : '#e2e8f0',
                },
              }}
            />

            <Chip
              label={`Paid Users (Silver / Premium) (${activeTab === 'all' ? counts.totalPaid : activeTab === 'pending' ? counts.pendingPaid : counts.activePaid})`}
              size="small"
              clickable
              onClick={() => setSubFilter('paid')}
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                backgroundColor: subFilter === 'paid' ? '#d97706' : '#f1f5f9',
                color: subFilter === 'paid' ? '#ffffff' : '#475569',
                '&:hover': {
                  backgroundColor: subFilter === 'paid' ? '#b45309' : '#e2e8f0',
                },
              }}
            />
          </Box>
        )}

        {/* Table Content */}
        <TableContainer>
          <Table size="small" sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', py: 1.25 }}>Reg No</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', py: 1.25 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', py: 1.25 }}>Gender / Age</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', py: 1.25 }}>Contact Info</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', py: 1.25 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', py: 1.25 }}>Plan / Tier</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', py: 1.25 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', py: 1.25 }}>Joined On</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', py: 1.25 }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const free = isFreeUser(user);
                  const paid = isPaidUser(user);
                  const pending = isUserPending(user);
                  const active = isUserActive(user);

                  return (
                    <TableRow
                      key={user._id || user.registration_no}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      {/* Reg No */}
                      <TableCell sx={{ py: 1.25 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>
                            {user.registration_no || '—'}
                          </Typography>
                          {user.registration_no && (
                            <Tooltip title={copiedId === user.registration_no ? 'Copied!' : 'Copy Reg No'}>
                              <IconButton
                                size="small"
                                onClick={() => handleCopy(user.registration_no)}
                                sx={{ p: 0.25, color: copiedId === user.registration_no ? '#16a34a' : '#94a3b8' }}
                              >
                                {copiedId === user.registration_no ? <CheckIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>

                      {/* Name */}
                      <TableCell sx={{ py: 1.25 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No Name'}
                        </Typography>
                        {user.caste && (
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                            {user.caste}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Gender / Age */}
                      <TableCell sx={{ py: 1.25 }}>
                        <Typography variant="body2" sx={{ color: '#334155' }}>
                          {user.gender || '—'}
                          {user.age ? `, ${user.age} yrs` : ''}
                        </Typography>
                      </TableCell>

                      {/* Contact */}
                      <TableCell sx={{ py: 1.25 }}>
                        <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.8rem' }}>
                          {user.mobile_no || '—'}
                        </Typography>
                        {user.email_id && (
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>
                            {user.email_id}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Location */}
                      <TableCell sx={{ py: 1.25 }}>
                        <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.8rem' }}>
                          {user.city || user.state || '—'}
                        </Typography>
                      </TableCell>

                      {/* Plan / Tier */}
                      <TableCell sx={{ py: 1.25 }}>
                        {paid ? (() => {
                          const role = (user.user_role || user.type_of_user || '').toLowerCase();
                          const isPremium = role.includes('premium');
                          const isSilver = role.includes('silver');
                          return (
                            <Chip
                              label={isPremium ? 'Premium' : isSilver ? 'Silver' : (user.user_role || user.type_of_user || 'Paid')}
                              size="small"
                              sx={{
                                backgroundColor: isPremium ? '#fef3c7' : '#e0f2fe',
                                color: isPremium ? '#92400e' : '#0369a1',
                                fontWeight: 600,
                                fontSize: '0.72rem',
                                height: 22,
                                borderRadius: '4px',
                              }}
                            />
                          );
                        })() : (
                          <Chip
                            label="Free User"
                            size="small"
                            sx={{
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              fontWeight: 500,
                              fontSize: '0.72rem',
                              height: 22,
                              borderRadius: '4px',
                            }}
                          />
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={{ py: 1.25 }}>
                        {active ? (
                          <Chip
                            icon={<CheckCircleIcon sx={{ fontSize: '13px !important' }} />}
                            label="Active"
                            size="small"
                            sx={{
                              backgroundColor: '#dcfce7',
                              color: '#166534',
                              fontWeight: 600,
                              fontSize: '0.72rem',
                              height: 22,
                              borderRadius: '4px',
                              '& .MuiChip-icon': { color: '#166534' }
                            }}
                          />
                        ) : pending ? (
                          <Chip
                            icon={<HourglassIcon sx={{ fontSize: '13px !important' }} />}
                            label="Pending Approval"
                            size="small"
                            sx={{
                              backgroundColor: '#fff7ed',
                              color: '#c2410c',
                              fontWeight: 600,
                              fontSize: '0.72rem',
                              height: 22,
                              borderRadius: '4px',
                              '& .MuiChip-icon': { color: '#c2410c' }
                            }}
                          />
                        ) : (
                          <Chip
                            label={user.status || 'Inactive'}
                            size="small"
                            sx={{
                              backgroundColor: '#f1f5f9',
                              color: '#64748b',
                              fontSize: '0.72rem',
                              height: 22,
                              borderRadius: '4px',
                            }}
                          />
                        )}
                      </TableCell>

                      {/* Reg Date */}
                      <TableCell sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {user.registration_date || '—'}
                        </Typography>
                      </TableCell>

                      {/* Action Column */}
                      <TableCell align="center" sx={{ py: 1.25 }}>
                        {pending ? (
                          free && isActivationAllowed ? (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => handleOpenActivate(user)}
                              startIcon={<CheckIcon fontSize="small" />}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                py: 0.25,
                                px: 1.2,
                                borderRadius: '6px',
                                borderColor: '#16a34a',
                                color: '#15803d',
                                '&:hover': {
                                  borderColor: '#15803d',
                                  backgroundColor: '#f0fdf4',
                                },
                              }}
                            >
                              Activate
                            </Button>
                          ) : paid ? (
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.72rem' }}>
                              Admin Approval
                            </Typography>
                          ) : (
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                              —
                            </Typography>
                          )
                        ) : active ? (
                          <Chip
                            label="Already Active"
                            size="small"
                            sx={{
                              backgroundColor: '#dcfce7',
                              color: '#166534',
                              fontWeight: 600,
                              fontSize: '0.72rem',
                              height: 22,
                              borderRadius: '4px',
                              border: '1px solid #bbf7d0',
                            }}
                          />
                        ) : (
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {searchQuery
                        ? `No referrals matched "${searchQuery}".`
                        : `No users found under ${activeTab.toUpperCase()} tab.`}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Confirmation Dialog for Free User Activation */}
      <Dialog
        open={activateDialogOpen}
        onClose={() => !activateUserMutation.isPending && setActivateDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>
          Activate Free Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#475569', fontSize: '0.9rem' }}>
            Are you sure you want to activate the profile for{' '}
            <strong>
              {selectedUserToActivate?.first_name} {selectedUserToActivate?.last_name}
            </strong>{' '}
            ({selectedUserToActivate?.registration_no})?
          </DialogContentText>
          <Alert severity="info" sx={{ mt: 2, fontSize: '0.8rem' }}>
            This will immediately mark the profile as <strong>Active</strong> and send an activation notification email to the user.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setActivateDialogOpen(false)}
            disabled={activateUserMutation.isPending}
            sx={{ textTransform: 'none', color: '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmActivate}
            disabled={activateUserMutation.isPending}
            startIcon={activateUserMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: '#16a34a',
              '&:hover': { backgroundColor: '#15803d' },
            }}
          >
            {activateUserMutation.isPending ? 'Activating...' : 'Confirm Activate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReferralsTable;
