"use client"

import { useState } from "react"
import {
  Switch,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Box,
} from "@mui/material"
import SecurityLevelIndicator from "./security-level-indicator"

const TwoFactorSetup = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [optOutDialogOpen, setOptOutDialogOpen] = useState(false)

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
  }

  const handleSkipSetup = () => {
    // Implement skip setup logic here (e.g., redirect, update user settings)
    alert("Skipping 2FA setup.")
  }

  const handleOptOutOpen = () => {
    setOptOutDialogOpen(true)
  }

  const handleOptOutClose = () => {
    setOptOutDialogOpen(false)
  }

  const handleOptOutConfirm = () => {
    // Implement opt-out logic here (e.g., disable 2FA in user settings)
    setTwoFactorEnabled(false)
    setOptOutDialogOpen(false)
    alert("2FA has been disabled.")
  }

  return (
    <Box>
      <Typography variant="h6" color="warning" gutterBottom>
        2FA is Optional
      </Typography>

      <Box mb={2}>
        <Typography variant="body1">Enable 2FA for enhanced security.</Typography>
        <Switch
          checked={twoFactorEnabled}
          onChange={handleToggle2FA}
          name="twoFactorEnabled"
          inputProps={{ "aria-label": "Enable Two-Factor Authentication" }}
        />
        <Typography variant="body2">2FA is currently {twoFactorEnabled ? "Enabled" : "Disabled"}</Typography>
      </Box>

      <Box mb={2}>
        <Button variant="outlined" onClick={handleSkipSetup}>
          Skip 2FA Setup
        </Button>
      </Box>

      <SecurityLevelIndicator enabled={twoFactorEnabled} />

      <Box mt={3}>
        <Typography variant="h6">Opt Out of 2FA</Typography>
        <Button variant="contained" color="error" onClick={handleOptOutOpen} disabled={!twoFactorEnabled}>
          Opt Out of 2FA
        </Button>

        <Dialog
          open={optOutDialogOpen}
          onClose={handleOptOutClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Disable Two-Factor Authentication?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Disabling 2FA will significantly reduce the security of your account. Are you sure you want to proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOptOutClose}>Cancel</Button>
            <Button onClick={handleOptOutConfirm} color="error" autoFocus>
              Confirm Opt Out
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default TwoFactorSetup
