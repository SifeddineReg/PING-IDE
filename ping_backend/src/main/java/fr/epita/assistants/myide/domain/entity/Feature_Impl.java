package fr.epita.assistants.myide.domain.entity;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.eclipse.jgit.api.Git;

public class Feature_Impl implements Feature{
    private final Object type;

    public Feature_Impl(Feature.Type type) {
        this.type = type;
    }

    @Override
    public @NotNull ExecutionReport execute(Project project, Object... params) {
        if (type == Mandatory.Features.Any.CLEANUP) {
            return cleanup(project, params);
        } else if (type == Mandatory.Features.Any.DIST) {
            return dist(project, params);
        } else if (type == Mandatory.Features.Any.SEARCH) {
            return search(project, params);
        } else if (type == Mandatory.Features.Git.PULL) {
            return pull(project, params);
        } else if (type == Mandatory.Features.Git.ADD) {
            return add(project, params);
        } else if (type == Mandatory.Features.Git.COMMIT) {
            return commit(project, params);
        } else if (type == Mandatory.Features.Git.PUSH) {
            return push(project, params);
        } else if (type == Mandatory.Features.Maven.COMPILE) {
            return compile(project, params);
        } else if (type == Mandatory.Features.Maven.CLEAN) {
            return clean(project, params);
        } else if (type == Mandatory.Features.Maven.TEST) {
            return test(project, params);
        } else if (type == Mandatory.Features.Maven.PACKAGE) {
            return package_(project, params);
        } else if (type == Mandatory.Features.Maven.INSTALL) {
            return install(project, params);
        } else if (type == Mandatory.Features.Maven.TREE) {
            return tree(project, params);
        } else if (type == Mandatory.Features.Maven.EXEC) {
            return exec(project, params);
        } else {
            throw new UnsupportedOperationException("Unimplemented feature");
        }
    }

    @Override
    public @NotNull Type type() {
        return (Feature.Type) type;
    }

    public ExecutionReport cleanup(Project project, Object... params) {
        Path path = project.getRootNode().getPath();
        if (path.toString().endsWith("/")) {
            path = path.getParent();
        }
        File ignoreFile = new File(path.toString() + "/.myideignore");
        if (!ignoreFile.exists()) {
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }

        try {
            List<String> ignoreList = Files.readAllLines(ignoreFile.toPath());
            for (String ignore : ignoreList) {
                File file = new File(path.toString() + "/" + ignore);
                if (file.exists()) {
                    file.delete();
                }
            }
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return true;
                }
            };
        } catch (IOException e) {
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }

    public ExecutionReport dist(Project project, Object... params) {
        Path path = project.getRootNode().getPath();
        if (path.toString().endsWith("/")) {
            path = path.getParent();
        }

        File ignoreFile = new File(path.toString() + "/.myideignore");
        if (!ignoreFile.exists()) {
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }

        try {
            List<String> ignoreList = Files.readAllLines(ignoreFile.toPath());
            for (String ignore : ignoreList) {
                File file = new File(path.toString() + "/" + ignore);
                if (file.exists()) {
                    file.delete();
                }
            }
            ProcessBuilder builder = new ProcessBuilder();
            builder.command("zip", "-r", path.toString() + ".zip", path.toString());
            Process process = builder.start();
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return true;
                    }
                };
            } else {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return false;
                    }
                };
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }

    public ExecutionReport search(Project project, Object... params) {        
        Path path = project.getRootNode().getPath();
        
        try {
            ProcessBuilder builder = new ProcessBuilder();
            builder.command("grep", "-r", (String) params[0], path.toString());
            Process process = builder.start();
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return true;
                    }
                };
            } else {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return false;
                    }
                };
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }

    public ExecutionReport pull(Project project, Object... params) {
        try {
            Git git = Git.open(project.getRootNode().getPath().toFile());
            git.pull().call();
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return true;
                }
            };
        } catch (Exception e) {
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }

    public ExecutionReport add(Project project, Object... params) {
        if (params.length == 0) {
            throw new IllegalArgumentException("No file specified for 'add'");
        }
        try {
            Git git = Git.open(project.getRootNode().getPath().toFile());
            for (Object param : params) {
                String file = (String) param;
                if (!new File(project.getRootNode().getPath().toString() + "/" + file).exists()) {
                    return new ExecutionReport() {
                        @Override
                        public boolean isSuccess() {
                            return false;
                        }
                    };
                }
                git.add().addFilepattern((String) param).call();
            }
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return true;
                }
            };
        } catch (Exception e) {
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }

    public ExecutionReport commit(Project project, Object... params) {
        if (params.length == 0) {
            throw new IllegalArgumentException("No message specified for 'commit'");
        }
        try {
            Git git = Git.open(project.getRootNode().getPath().toFile());
            git.commit().setMessage((String) params[0]).call();
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return true;
                }
            };
        } catch (Exception e) {
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }

    public ExecutionReport push(Project project, Object... params) {
        try {
            Git git = Git.open(project.getRootNode().getPath().toFile());
            git.push().call();
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return true;
                }
            };
        } catch (Exception e) {
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }

    public ExecutionReport compile(Project project, Object... params) {
        try {
            ProcessBuilder builder = new ProcessBuilder();
            builder.command("mvn", "compile");
            builder.directory(new File(project.getRootNode().getPath().toString()));
            Process process = builder.start();
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return true;
                    }
                };
            } else {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return false;
                    }
                };
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }

    public ExecutionReport clean(Project project, Object... params) {
        // mvn clean
        try {
            ProcessBuilder builder = new ProcessBuilder();
            builder.command("mvn", "clean");
            builder.directory(new File(project.getRootNode().getPath().toString()));
            Process process = builder.start();
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return true;
                    }
                };
            } else {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return false;
                    }
                };
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }

    public ExecutionReport test(Project project, Object... params) {
        // mvn test
        try {
            ProcessBuilder builder = new ProcessBuilder();
            builder.command("mvn", "test");
            builder.directory(new File(project.getRootNode().getPath().toString()));
            Process process = builder.start();
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return true;
                    }
                };
            } else {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return false;
                    }
                };
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }

    public ExecutionReport package_(Project project, Object... params) {
        // mvn package
        try {
            ProcessBuilder builder = new ProcessBuilder();
            builder.command("mvn", "package");
            builder.directory(new File(project.getRootNode().getPath().toString()));
            Process process = builder.start();
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return true;
                    }
                };
            } else {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return false;
                    }
                };
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }

    public ExecutionReport install(Project project, Object... params) {
        // mvn install
        try {
            ProcessBuilder builder = new ProcessBuilder();
            builder.command("mvn", "install");
            builder.directory(new File(project.getRootNode().getPath().toString()));
            Process process = builder.start();
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return true;
                    }
                };
            } else {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return false;
                    }
                };
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }

    public ExecutionReport tree(Project project, Object... params) {
        // mvn dependency:tree
        try {
            ProcessBuilder builder = new ProcessBuilder();
            builder.command("mvn", "dependency:tree");
            builder.directory(new File(project.getRootNode().getPath().toString()));
            Process process = builder.start();
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return true;
                    }
                };
            } else {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return false;
                    }
                };
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }

    public ExecutionReport exec(Project project, Object... params) {
        // mvn exec:java
        try {
            ProcessBuilder builder = new ProcessBuilder();
            builder.command("mvn", "exec:java");
            builder.directory(new File(project.getRootNode().getPath().toString()));
            Process process = builder.start();
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return true;
                    }
                };
            } else {
                return new ExecutionReport() {
                    @Override
                    public boolean isSuccess() {
                        return false;
                    }
                };
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return new ExecutionReport() {
                @Override
                public boolean isSuccess() {
                    return false;
                }
            };
        }
    }
}