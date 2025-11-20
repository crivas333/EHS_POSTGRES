'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Print, Close } from '@mui/icons-material';

const COLUMNS = ['Sph', 'Cyl', 'Axis', 'Acuity', 'ADD', 'Jaeger', 'Prism'];

export default function AutoRefractionForm() {
  const [refractionComments, setRefractionComments] = useState('');

  // 7 fields per eye
  const [od, setOd] = useState(Array(7).fill(''));
  const [os, setOs] = useState(Array(7).fill(''));

  const handleOd = (i, v) => {
    const n = [...od];
    n[i] = v;
    setOd(n);
  };

  const handleOs = (i, v) => {
    const n = [...os];
    n[i] = v;
    setOs(n);
  };

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 3 }}>
      <Card elevation={1} sx={{ border: '1px solid #e5e7eb' }}>
        {/* Header */}
        <CardHeader
          title={<Typography variant="h6" fontWeight={600}>Auto Refraction</Typography>}
          action={
            <Stack direction="row" spacing={1}>
              <IconButton size="small" disableRipple sx={{ '&:hover': { bgcolor: 'transparent' } }}>
                <Print fontSize="small" />
              </IconButton>
              <IconButton size="small" disableRipple sx={{ '&:hover': { bgcolor: 'transparent' } }}>
                <Close fontSize="small" />
              </IconButton>
            </Stack>
          }
          sx={{ pb: 0, pt: 2, px: 3 }}
        />

        {/* 3×7 Grid */}
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            {/* Header Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', gap: 1 }}>
              <Box />
              {COLUMNS.map((c) => (
                <Typography
                  key={c}
                  variant="subtitle2"
                  fontWeight={500}
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    backgroundColor: '#fffbeb',
                    borderRadius: 1,
                    color: '#92400e',
                    userSelect: 'none',
                  }}
                >
                  {c}
                </Typography>
              ))}
            </Box>

            {/* OD Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', gap: 1, alignItems: 'center' }}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ textAlign: 'right', pr: 1 }}
              >
                OD:
              </Typography>
              {COLUMNS.map((_, i) => (
                <TextField
                  key={i}
                  size="small"
                  variant="outlined"
                  value={od[i]}
                  onChange={(e) => handleOd(i, e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#fffbeb',
                      '& fieldset': { borderColor: '#fde68a' },
                      '&:hover fieldset': { borderColor: '#f59e0b' },
                      '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                    },
                  }}
                  InputProps={{ sx: { fontSize: '0.875rem' } }}
                />
              ))}
            </Box>

            {/* OS Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', gap: 1, alignItems: 'center' }}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ textAlign: 'right', pr: 1 }}
              >
                OS:
              </Typography>
              {COLUMNS.map((_, i) => (
                <TextField
                  key={i}
                  size="small"
                  variant="outlined"
                  value={os[i]}
                  onChange={(e) => handleOs(i, e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#fffbeb',
                      '& fieldset': { borderColor: '#fde68a' },
                      '&:hover fieldset': { borderColor: '#f59e0b' },
                      '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                    },
                  }}
                  InputProps={{ sx: { fontSize: '0.875rem' } }}
                />
              ))}
            </Box>

            {/* Refraction Comments */}
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ width: 60, textAlign: 'right', pt: 1.5 }}
              >
                Refraction Comments:
              </Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={refractionComments}
                onChange={(e) => setRefractionComments(e.target.value)}
                variant="outlined"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fffbeb',
                    '& fieldset': { borderColor: '#fde68a' },
                    '&:hover fieldset': { borderColor: '#f59e0b' },
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                  },
                }}
                InputProps={{ sx: { fontSize: '0.875rem' } }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}