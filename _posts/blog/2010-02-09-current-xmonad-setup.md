--- 
layout: post
title: Current Xmonad Setup
category: blog
created: 1265729463
tags: [xmonad, linux]
---

My `xmonad.hs`:

{% highlight haskell %}
import XMonad
import XMonad.Hooks.DynamicLog
import XMonad.Hooks.ManageDocks
import XMonad.Util.Run(spawnPipe)
import XMonad.Util.EZConfig
import System.IO
import XMonad.Layout.NoBorders
import XMonad.Layout.IM
import Data.Ratio ((%))
import XMonad.Layout.Grid
import XMonad.Prompt
import XMonad.Prompt.Shell
import XMonad.Actions.GridSelect
import XMonad.Layout.SimplestFloat
import XMonad.Layout.Reflect
import qualified XMonad.StackSet as W
import XMonad.Layout.ResizableTile
import XMonad.Layout.PerWorkspace
import XMonad.Hooks.ManageHelpers

myManageHook = composeAll
    [ (role =? "gimp-toolbox" <||> role =? "gimp-image-window") --> (ask >>= doF . W.sink)
    , className =? "Skype"                --> doShift "3:skype"
    , className =? "Chrome"               --> doShift "2:web"
    , className =? "Shiretoko"            --> doShift "2:web"
    , className =? "Evince"               --> doShift "6:pdf"
    , className =? "feh"                  --> doCenterFloat
    , className =? "Gimp"                 --> doShift "4:gimp"
    , className =? "Keepassx"             --> doShift "2:web"
    , className =? "ROX-Filer"            --> doCenterFloat
    , className =? "XCalc"                --> doCenterFloat
    , className =? "OpenOffice.org 3.1"   --> doShift "7:office"
    , className =? "Pidgin"               --> doShift "5:pidgin"
    ]
  where role = stringProperty "WM_WINDOW_ROLE"

myLayoutHook = smartBorders $ avoidStruts $ onWorkspace "5:pidgin" pidginLayout $ onWorkspace "4:gimp" gimpLayout $ onWorkspaces ["2:web", "6:pdf", "7:office"] Full $ onWorkspace "3:skype" Grid $ tiled ||| Full ||| Grid ||| simplestFloat
  where
    tiled = ResizableTall 1 (3/100) (1/2) []
    gimpLayout = withIM (0.20) (Role "gimp-toolbox") $ reflectHoriz $ withIM (0.20) (Role "gimp-dock") Full
    pidginLayout = withIM (1/7) (Role "buddy_list") Grid

myXPConfig = defaultXPConfig { fgColor   = "#FFFFFF"
                              , bgColor  = "#000000"
                              , bgHLight = "cyan"
                              , fgHLight = "#FFFFFF"
                              , font     = "xft:Terminus:pixelsize=12"
                              }

myLogHook :: Handle -> X ()
myLogHook h = dynamicLogWithPP $ customPP { ppOutput = hPutStrLn h }

customPP :: PP
customPP = defaultPP { ppCurrent = xmobarColor "#FFFFFF" ""
                     , ppUrgent  = xmobarColor "#FF0000" ""
                     , ppLayout  = xmobarColor "orange" ""
                     , ppTitle   = xmobarColor "#FFFFFF" "" . shorten 80
                     }

myWorkspaces = ["1:main", "2:web", "3:skype", "4:gimp", "5:pidgin", "6:pdf", "7:office"] ++ map show [8..9]

main = do
    xmproc <- spawnPipe "xmobar"
    xmonad $ defaultConfig
        { manageHook = manageDocks <+> myManageHook <+> manageHook defaultConfig
        , layoutHook = myLayoutHook
        , logHook = myLogHook xmproc
        , modMask = mod4Mask
        , terminal = "urxvt"
        , focusFollowsMouse = False
        , borderWidth = 1
        , normalBorderColor  = "#999"
        , focusedBorderColor = "#ee9a00"
        , workspaces = myWorkspaces
        } `additionalKeys`
        [ ((0, 0x1008ff13), spawn "amixer sset PCM 5+")
        , ((0, 0x1008ff11), spawn "amixer sset PCM 5-")
        , ((mod4Mask .|. shiftMask, xK_p), shellPrompt myXPConfig)
        , ((mod4Mask, xK_g), goToSelected defaultGSConfig)
        , ((mod4Mask, xK_a), sendMessage MirrorShrink)
        , ((mod4Mask, xK_z), sendMessage MirrorExpand)
        ]
{% endhighlight %}

My `.xmobarrc`:

{% highlight haskell %}
Config { font = "xft:Terminus:pixelsize=12"
       , bgColor = "#000000"
       , fgColor = "grey"
       , position = TopW L 90
       , lowerOnStart = True
       , commands = [ Run Cpu ["-L","3","-H","50","--normal","green","--high","red"] 10
                    , Run Memory ["-t","Mem: <usedratio>%"] 10
                    , Run Swap [] 10
                    , Run Date "%a %b %_d %l:%M" "date" 10
                    , Run StdinReader
                    , Run Battery ["-l", "#FF0000"] 600
                    , Run CoreTemp ["-t","<core0>","-L","40","-H","60","-l","lightblue","-n","orange","-h","red"] 50
                    , Run Com "/home/personal/scripts/volume.sh" [] "vol" 10
                    ]
       , sepChar = "%"
       , alignSep = "}{"
       , template = "%StdinReader% }{ %vol% <fc=#ffffff>%battery%</fc> %cpu% Temp: %coretemp% %memory% %swap% <fc=#ee9a00>%date%</fc>"
       }
{% endhighlight %}

Most are copied from [Xmonad's Config Archive](http://haskell.org/haskellwiki/Xmonad/Config_archive). As for the volume script in xmobar, you may find this [thread](http://bbs.archlinux.org/viewtopic.php?id=74842) helpful.

This is how it would somehow look:

Workspace 1 with `ResizableTall`:

[<img src="http://dl.dropbox.com/u/24796303/blog/2010-02-10-081038_1280x800_scrot.png" width="383" />](http://dl.dropbox.com/u/24796303/blog/2010-02-10-081038_1280x800_scrot.png)

Workspace 4 with `Gimp Layout`:

[<img src="http://dl.dropbox.com/u/24796303/blog/2010-02-10-090623_1280x800_scrot.png" width="383" />](http://dl.dropbox.com/u/24796303/blog/2010-02-10-090623_1280x800_scrot.png)

The _Gimp Layout_ can be found [here](http://nathanhowell.net/2009/03/08/xmonad-and-the-gimp/). You may also find this [article](http://www.haskell.org/haskellwiki/Xmonad/General_xmonad.hs_config_tips#Tiling_most_windows_in_gimp) helpful. I'm not quite sure but I believe, if you've used the default settings, Gimp windows are floating.

Workspace 5 with `IM Grid`:

[<img src="http://dl.dropbox.com/u/24796303/blog/2010-02-10-083559_1280x800_scrot_0.png" width="383" />](http://dl.dropbox.com/u/24796303/blog/2010-02-10-083559_1280x800_scrot_0.png)

More info on the _IM Grid_ layout can be found [here](http://xmonad.org/xmonad-docs/xmonad-contrib/XMonad-Layout-IM.html).
